import type { Preview } from "storybook";

const preview: Preview = {
    parameters: {
        layout: "padded",
        controls: {
            expanded: true
        },
        backgrounds: {
            default: "Canvas",
            values: [
                {name: "Canvas", value: "#f6f7fb"},
                {name: "Midnight", value: "#162033"}
            ]
        }
    }
};

export default preview;
