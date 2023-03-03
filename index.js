const plugin = require('tailwindcss/plugin');

module.exports = plugin(
    function ({ addComponents, prefix, theme, addVariant }) {
        // options
        const options = theme('aemGrid');
        const inBreakpoints = options.breakpoints;
        const columns = options.columns;
        const mantainBreakpoints = options.mantainBreakpoints;

        //fn
        function prefixName(str) {
            var name = prefix(`.${str}`);
            return name.substring(1);
        }

        function getNum(str) {
            const thenum = str.replace(/^\D+/g, '');
            return parseInt(thenum);
        }

        /// runs
        if (!mantainBreakpoints) {
            const screens = theme('screens');

            mobileBrk = getNum(screens[inBreakpoints.tablet]) - 1 + 'px';
            tabletBrk = getNum(screens[inBreakpoints.desktop]) - 1 + 'px';
            addVariant('aemsm', `@media screen and (max-width: ${mobileBrk})`);
            addVariant(
                'aemmd',
                `@media screen and (min-width: ${screens[inBreakpoints.tablet]}) and (max-width: ${tabletBrk})`
            );
        }

        // create breakpoints
        const breakpoints = {
            mobile: mantainBreakpoints ? inBreakpoints.mobile : 'aemsm',
            tablet: mantainBreakpoints ? inBreakpoints.tablet : 'aemmd',
            default: inBreakpoints.desktop,
        };

        const aemGrid = {};

        // grid
        aemGrid[`.aem-Grid`] = {};
        aemGrid[`.aem-Grid`][`@apply ${prefixName(`grid`)}`] = {};

        // columns definition
        aemGrid[`.aem-Grid--${columns}`] = {};
        aemGrid[`.aem-Grid--${columns}`][`@apply ${prefixName(`grid-cols-${columns}`)}`] = {};

        // newComponent
        aemGrid[`.aem-Grid--${columns} > .aem-Grid-newComponent`] = {};
        aemGrid[`.aem-Grid--${columns} > .aem-Grid-newComponent`][
            `@apply ${prefixName(`col-start-1`)} ${prefixName(`col-span-${columns}`)}`
        ] = {};

        // generate default column size
        aemGrid[`.aem-Grid--${columns} > .aem-GridColumn`] = {};
        let allStr = [];
        for (const key in breakpoints) {
            const value = breakpoints[key];
            allStr.push(`${value}:${prefixName(`col-span-${columns}`)}`);
        }
        aemGrid[`.aem-Grid--${columns} > .aem-GridColumn`][`@apply ${allStr.join(' ')}`] = {};

        // generate grid
        for (const key in breakpoints) {
            const value = breakpoints[key];

            // width
            for (let i = 1; i <= columns; i++) {
                aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--${i}`] = {};
                aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--${i}`] = {};
                aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--${i}`][
                    `@apply ${value}:${prefixName(`col-span-${i}`)}`
                ] = {};
            }

            // offset ( offset 0 cannot be exist )
            for (let i = 2; i <= columns; i++) {
                aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--offset--${key}--${i - 1}`] = {};
                aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--offset--${key}--${i - 1}`] = {};
                aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--offset--${key}--${i - 1}`][
                    `@apply ${value}:${prefixName(`col-start-${i}`)}`
                ] = {};
            }

            // newline
            aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--newline`] = {};
            aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--newline`] = {};
            aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--newline`][
                `@apply ${value}:${prefixName(`col-start-1`)}`
            ] = {};

            // hide
            aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--hide`] = {};
            aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--hide`] = {};
            aemGrid[`.aem-Grid--${columns} > .aem-GridColumn--${key}--hide`][
                `@apply ${value}:${prefixName(`hidden`)}`
            ] = {};

            // force show
            aemGrid[`.aem-GridShowHidden > .aem-Grid > .aem-GridColumn--${key}--hide`] = {};
            aemGrid[`.aem-GridShowHidden > .aem-Grid > .aem-GridColumn--${key}--hide`] = {};
            aemGrid[`.aem-GridShowHidden > .aem-Grid > .aem-GridColumn--${key}--hide`][
                `@apply ${value}:${prefixName(`block`)}`
            ] = {};
        }

        console.log(aemGrid);

        addComponents(aemGrid, { respectPrefix: false });
    },
    {
        theme: {
            aemGrid: {
                mantainBreakpoints: false,
                breakpoints: {
                    desktop: 'lg',
                    tablet: 'md',
                    mobile: null,
                },
                columns: 6,
            },
        },
    }
);
