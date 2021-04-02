(function (wp) {
    // Buttons Variations
    wp.blocks.registerBlockVariation(
        'core/buttons',
        [
            {
                name: 'large',
                title: 'Large Buttons',
                attributes: {
                    className: 'large-btn'
                },
            }
        ]
    );

    var el = wp.element.createElement;

    /**
     * Add custom attribute for custom options.
     *
     * @param {Object} settings Settings for the block.
     *
     * @return {Object} settings Modified settings.
     */
    function addAttributes(settings) {
        if (!(settings.name.startsWith("kobu-custom-blocks/") || settings.name.startsWith("core/")) || settings.name === "core/button") {
            return settings;
        }

        //check if object exists for old Gutenberg version compatibility
        if (typeof settings.attributes !== 'undefined') {
            settings.attributes = Object.assign(settings.attributes, {
                customAlign: {
                    type: 'string',
                    default: '',
                }
            });
        }

        if (typeof settings.supports !== 'undefined' && settings.name === "core/paragraph") {
            settings.supports = Object.assign({}, settings.supports, {
                align: ['wide', 'full']
            });
        }

        return settings;
    }

    wp.hooks.addFilter('blocks.registerBlockType', 'kobu/custom-attributes', addAttributes);

    /**
     * Add custom options: Alignment
     *
     * @param {function} BlockEdit Block edit component.
     *
     * @return {function} BlockEdit Modified block edit component.
     */
    var withInspectorControls = wp.compose.createHigherOrderComponent(function (BlockEdit) {
        return function (props) {
            if (!(props.name.startsWith("kobu-custom-blocks/") || props.name.startsWith("core/"))) {
                return el(
                    BlockEdit,
                    props
                );
            }

            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var isSelected = props.isSelected;
            var customAlign = attributes.customAlign;
            var align = attributes.align;

            var hasAlign = typeof align !== 'undefined' && align;

            return el(
                wp.element.Fragment,
                {},
                el(
                    BlockEdit,
                    props
                ),
                el(
                    wp.blockEditor.InspectorControls,
                    {},
                    isSelected && el(
                        wp.components.PanelBody,
                        {
                            title: 'Custom Options',
                            className: 'custom-options-panel',
                            initialOpen: true
                        },
                        !hasAlign && el(
                            wp.components.SelectControl,
                            {
                                className: 'custom-alignment',
                                label: 'Custom Alignment',
                                value: customAlign,
                                onChange: function (value) {
                                    setAttributes({ customAlign: value })
                                },
                                options: [
                                    { label: 'Default', value: '' },
                                    { label: 'Extra wide', value: 'extrawide' },
                                ]
                            }
                        ),
                        hasAlign && el(
                            'div',
                            {},
                            'You need to remove "wide" or "full" alignment before adding a custom one.'
                        )
                    )
                )
            );
        };
    }, 'withInspectorControls');

    wp.hooks.addFilter('editor.BlockEdit', 'kobu/withInspectorControls', withInspectorControls);

    /**
     * Add custom element class in save element.
     *
     * @param {Object} extraProps     Block element.
     * @param {Object} blockType      Blocks object.
     * @param {Object} attributes     Blocks attributes.
     *
     * @return {Object} extraProps Modified block element.
     */

    function applyExtraClass(extraProps, blockType, attributes) {
        var customAlign = attributes.customAlign;
        var align = attributes.align;
        var hasAlign = typeof align !== 'undefined' && align;

        //check if attribute exists for old Gutenberg version compatibility
        //add class only when has custom alignment
        if (typeof customAlign !== 'undefined' && customAlign && !hasAlign) {
            extraProps.className = (extraProps.className ? extraProps.className : '') + ' align' + customAlign;
        }

        return extraProps;
    }

    wp.hooks.addFilter('blocks.getSaveContent.extraProps', 'kobu/applyExtraClass', applyExtraClass);


    /**
     * Add custom options to block wrapper in editor
     *
     */
    var withClientIdClassName = wp.compose.createHigherOrderComponent(function (BlockListBlock) {
        return function (props) {
            var block = props.block;

            if (!(block.name.startsWith("kobu-custom-blocks/") || block.name.startsWith("core/"))) {
                return el(
                    BlockListBlock,
                    props
                );
            }

            var customAlign = props.attributes.customAlign;

            //check if attribute exists for old Gutenberg version compatibility
            //add class only when has custom alignment
            if (typeof customAlign !== 'undefined' && customAlign) {
                var newProps = lodash.assign(
                    {},
                    props,
                    {
                        className: 'align' + customAlign,
                    }
                );

                return el(
                    BlockListBlock,
                    newProps
                );
            } else {
                return el(
                    BlockListBlock,
                    props
                );
            }
        };
    }, 'withClientIdClassName');

    wp.hooks.addFilter('editor.BlockListBlock', 'kobu/with-client-id-class-name', withClientIdClassName);
})(window.wp);