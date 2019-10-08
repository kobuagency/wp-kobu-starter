( function( wp ) {
    var highlightTextButton = function( props ) {
        return wp.element.createElement(
            wp.editor.RichTextToolbarButton, {
                icon: 'admin-customizer',
                title: 'Highlight text',
                onClick: function() {
                    props.onChange( wp.richText.toggleFormat(
                        props.value,
                        { type: 'kobu-custom-format/highlight-text' }
                    ) );
                },
                isActive: props.isActive,
            }
        );
    }
    wp.richText.registerFormatType(
        'kobu-custom-format/highlight-text', {
            title: 'Highlight text',
            tagName: 'span',
            className: 'highlight-text',
            edit: highlightTextButton,
        }
    );
} )( window.wp );