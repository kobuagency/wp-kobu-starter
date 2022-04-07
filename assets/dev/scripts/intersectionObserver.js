/*
 * Based on Loading attribute polyfill - https://github.com/mfranzke/loading-attribute-polyfill
 */

var intersectionObserver;
var lazyIntersectionObserver;

var observeElements = function (rootMargin) {
    'use strict';

    var lazyConfig = {
        // Start download if the item gets within 256px in the Y axis
        rootMargin: rootMargin || '0px 0px 256px 0px',
        threshold: 0.01,
        lazyImage: 'img[loading="lazy"]',
        lazyIframe: 'iframe[loading="lazy"]'
    };
    
    var notSelector = ':not(.responsive-spacer):not(.wp-block-group)';

    var config = {
        rootMargin: rootMargin || '0px 0px -20% 0px',
        threshold: 0.01,
        selector: '.site-content>*' + notSelector + ', .site-content>.wp-block-group>.wp-block-group__inner-container>*' + notSelector
    };

    // Device/browser capabilities object
    var capabilities = {
        loading:
            'loading' in HTMLImageElement.prototype &&
            'loading' in HTMLIFrameElement.prototype,
        scrolling: 'onscroll' in window
    };

    // Nodelist foreach polyfill / source: https://stackoverflow.com/a/46929259
    if (
        typeof NodeList !== 'undefined' &&
        NodeList.prototype &&
        !NodeList.prototype.forEach
    ) {
        // Yes, there's really no need for `Object.defineProperty` here
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    // On using a browser w/o requestAnimationFrame support (IE9, Opera Mini), just run the passed function
    var rAFWrapper;

    if ('requestAnimationFrame' in window) {
        rAFWrapper = window.requestAnimationFrame;
    } else {
        rAFWrapper = function (func) {
            func();
        };
    }

    /**
     * Remove the source tag preventing the loading of picture assets
     * @param {Object} lazyItemPicture Current <picture> item to be restored after lazy loading.
     */
    function removePlaceholderSource(lazyItemPicture) {
        var placeholderSource = lazyItemPicture.querySelector(
            'source[data-lazy-remove]'
        );

        if (placeholderSource) {
            lazyItemPicture.removeChild(placeholderSource); // Preferred .removeChild over .remove here for IE
        }
    }

    /**
     * Put the source and srcset back where it belongs - now that the elements content is attached to the document, it will load now
     * @param {Object} lazyItem Current item to be restored after lazy loading.
     */
    function restoreSource(lazyItem) {
        var srcsetItems = [];

        // Just in case the img is the decendent of a picture element, check for source tags
        if (lazyItem.parentNode.tagName.toLowerCase() === 'picture') {
            removePlaceholderSource(lazyItem.parentNode);

            srcsetItems = Array.prototype.slice.call(
                lazyItem.parentNode.querySelectorAll('source')
            );
        }

        srcsetItems.push(lazyItem);

        // Not using .dataset within those upfollowing lines of code for polyfill independent compatibility down to IE9
        srcsetItems.forEach(function (item) {
            if (item.hasAttribute('data-lazy-srcset')) {
                item.setAttribute('srcset', item.getAttribute('data-lazy-srcset'));
                item.removeAttribute('data-lazy-srcset'); // Not using delete .dataset here for compatibility down to IE9
            }
        });

        lazyItem.setAttribute('src', lazyItem.getAttribute('data-lazy-src'));
        lazyItem.removeAttribute('data-lazy-src'); // Not using delete .dataset here for compatibility down to IE9
        lazyItem.classList.remove('temp-img');

        var lazyLoadReplace = new Event('lazyLoadReplace', { bubbles: true });
        lazyItem.dispatchEvent(lazyLoadReplace);
    }

    /**
     * Handle IntersectionObservers callback
     * @param {Object} entries Target elements Intersection observed changes
     * @param {Object} observer IntersectionObserver instance reference
     */
    function onIntersection(entries, observer) {
        entries.forEach(function (entry) {
            // Mitigation for EDGE lacking support of .isIntersecting until v15, compare to e.g. https://github.com/w3c/IntersectionObserver/issues/211#issuecomment-309144669
            if (entry.intersectionRatio === 0) {
                return;
            }

            // If the item is visible now, load it and stop watching it
            var targetElem = entry.target;

            observer.unobserve(targetElem);

            if (targetElem.classList.contains('lazyload')) {
                restoreSource(targetElem);
            } else if (targetElem.classList.contains('animate')) {
                targetElem.classList.add('animated')
            }
        });
    }

    // Define according to browsers support of the IntersectionObserver feature (missing e.g. on IE11 or Safari 11)
    if ('IntersectionObserver' in window) {
        if (typeof intersectionObserver === 'undefined') {
            intersectionObserver = new IntersectionObserver(onIntersection, config);
        }
        if (typeof lazyIntersectionObserver === 'undefined') {
            lazyIntersectionObserver = new IntersectionObserver(onIntersection, lazyConfig);
        }
    }

    /**
     * Get and prepare the HTML code depending on feature detection for both image as well as iframe,
     * and if not scrolling supported, because it's a Google or Bing Bot
     * @param {String} lazyAreaHtml Noscript inner HTML code that src-urls need to get rewritten
     */
    function getAndPrepareHTMLCode(noScriptTag) {
        // The contents of a <noscript> tag are treated as text to JavaScript
        var lazyAreaHtml = noScriptTag.textContent || noScriptTag.innerHTML;

        var getImageWidth = lazyAreaHtml.match(/width=['"](\d+)['"]/) || false;
        var temporaryImageWidth = getImageWidth[1] || 1;
        var getImageHeight = lazyAreaHtml.match(/height=['"](\d+)['"]/) || false;
        var temporaryImageHeight = getImageHeight[1] || 1;

        var temporaryImage =
            'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 ' +
            temporaryImageWidth +
            ' ' +
            temporaryImageHeight +
            '%27%3E%3C/svg%3E';

        if (!capabilities.loading && capabilities.scrolling) {
            // Check for IntersectionObserver support
            if (typeof lazyIntersectionObserver === 'undefined') {
                // Attach abandonned attribute 'lazyload' to the HTML tags on browsers w/o IntersectionObserver being available
                lazyAreaHtml = lazyAreaHtml.replace(
                    /(?:\r\n|\r|\n|\t| )src=/g,
                    ' lazyload="1" src='
                );
            } else {
                if (noScriptTag.parentNode.tagName.toLowerCase() === 'picture') {
                    // Temporarily prevent expensive resource loading by inserting a <source> tag pointing to a simple one (data URI)
                    lazyAreaHtml =
                        '<source srcset="' +
                        temporaryImage +
                        '" data-lazy-remove="true"></source>' +
                        lazyAreaHtml;
                }

                // Temporarily replace a expensive resource load with a simple one by storing the actual source and srcset for later and point src to a temporary replacement (data URI)
                lazyAreaHtml = lazyAreaHtml
                    .replace(/(?:\r\n|\r|\n|\t| )srcset=/g, ' data-lazy-srcset=')
                    .replace(
                        /(?:\r\n|\r|\n|\t| )src=/g,
                        ' src="' + temporaryImage + '" data-lazy-src='
                    );
            }
        }

        return lazyAreaHtml;
    }

    /**
     * Retrieve the elements from the 'lazy load' <noscript> tag and prepare them for display
     * @param {Object} noScriptTag noscript HTML tag that should get initially transformed
     */
    function prepareLazyLoadElement(noScriptTag) {
        // Sticking the noscript HTML code in the innerHTML of a new <div> tag to 'load' it after creating that <div>
        var lazyArea = document.createElement('div');

        lazyArea.innerHTML = getAndPrepareHTMLCode(noScriptTag);

        // Move all children out of the element
        while (lazyArea.firstChild) {
            var imgSelector = lazyArea.querySelector('img');
            if (
                !capabilities.loading &&
                capabilities.scrolling &&
                typeof lazyIntersectionObserver !== 'undefined' &&
                imgSelector
            ) {
                // Observe the item so that loading could start when it gets close to the viewport
                imgSelector.classList.add('temp-img', 'lazyload')
                lazyIntersectionObserver.observe(imgSelector);
            }

            noScriptTag.parentNode.insertBefore(lazyArea.firstChild, noScriptTag);
        }

        // Remove the empty element - not using .remove() here for IE11 compatibility
        noScriptTag.parentNode.removeChild(noScriptTag); // Preferred .removeChild over .remove here for IE
    }

    function prepareAnimatedElement(elem) {
        if (typeof intersectionObserver !== 'undefined') {
            // Observe the item so that loading could start when it gets close to the viewport
            if (!elem.classList.contains('animate')) {
                elem.classList.add('animate');
                intersectionObserver.observe(elem);
            }
        } else {
            elem.classList.add('animated');
        }
    }

    /**
     * Handle printing the page
     */
    function onPrinting() {
        if (typeof window.matchMedia === 'undefined') {
            return;
        }

        var mediaQueryList = window.matchMedia('print');

        var changeFunction = function (mql) {
            if (mql.matches) {
                document
                    .querySelectorAll(
                        lazyConfig.lazyImage +
                        '[data-lazy-src],' +
                        lazyConfig.lazyIframe +
                        '[data-lazy-src]'
                    )
                    .forEach(function (lazyItem) {
                        restoreSource(lazyItem);
                    });

                document
                    .querySelectorAll(config.selector)
                    .forEach(function (block) {
                        block.classList.add('animated');
                    });
            }
        }

        if (mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener('change', changeFunction);
        } else if (mediaQueryList.attachEvent) {
            mediaQueryList.attachEvent('change', changeFunction);
        }
    }

    /**
     * Get all the <noscript> tags on the page and setup the printing
     */
    function prepareElements() {
        // Lazyload images
        var lazyLoadAreas = document.querySelectorAll('noscript.loading-lazy');
        lazyLoadAreas.forEach(prepareLazyLoadElement);

        // Animated blocks
        var animatedBlocks = document.querySelectorAll(config.selector);
        animatedBlocks.forEach(prepareAnimatedElement);

        // Bind for someone printing the page
        onPrinting();
    }

    // If the page has loaded already, run setup - if it hasn't, run as soon as it has.
    // Use requestAnimationFrame as this will propably cause repaints
    // document.readyState values: https://www.w3schools.com/jsref/prop_doc_readystate.asp
    if (/comp|inter/.test(document.readyState)) {
        rAFWrapper(prepareElements);
    } else if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function () {
            rAFWrapper(prepareElements);
        });
    } else {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState === 'complete') {
                prepareElements();
            }
        });
    }
}

observeElements();