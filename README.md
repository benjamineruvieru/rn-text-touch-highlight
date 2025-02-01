# React Native Text Touch Highlighter

<p align="center">
  <a href="https://www.npmjs.com/package/rn-text-touch-highlight">
    <img alt="npm version" src="https://badge.fury.io/js/rn-text-touch-highlight.svg"/>
  </a>
  <a title='License' href="https://github.com/benjamineruvieru/rn-text-touch-highlight/blob/master/LICENSE" height="18">
    <img src='https://img.shields.io/badge/license-MIT-blue.svg' />
  </a>
  <a title='Tweet' href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20React%20Native%20PDF%20from%20Image%20Library&url=https://github.com/benjamineruvieru/rn-text-touch-highlight&via=benjamin_eru&hashtags=react,reactnative,opensource,github,ux" height="18">
    <img src='https://img.shields.io/twitter/url/http/shields.io.svg?style=social' />
  </a>
</p>

React Native Text Touch Highlighter is a user friendly component library that enables users to effortlessly tap and drag to highlight text in React Native applications. This package simplifies the integration of text selection and annotation features, making it an ideal solution for mobile apps that require text highlighting or document annotation.

<p align="center">
  <img src="src/assets/example.gif" alt="example" height="300" width="380"/>
</p>

## Installation

To install this package, use npm or yarn:

```bash
npm install react-native-reanimated
npm install react-native-gesture-handler
npm install rn-text-touch-highlight
```

or

```bash
yarn add react-native-reanimated
yarn add react-native-gesture-handler
yarn add rn-text-touch-highlight
```

## Documentation

The docs can be found here: [https://docs.benjamineruvieru.com/rn-text-touch-highlight](https://docs.benjamineruvieru.com/rn-text-touch-highlight)

## Usage

Import the `HighlightText` component in your application and include it in your JSX:

```javascript
import { HighlightText } from 'rn-text-touch-highlight';

export default function App() {
  const highlightRef: any = React.useRef();

  const getHighlightData = () => {
    const data = highlightRef.current?.getHighlightedData();
    console.log(data);
  };
  const deleteFun = (id) => {
    highlightRef.current?.deleteHighlight(id);
  };

  return (
        <HighlightText
          ref={highlightRef}
          clearHighlightOnTap={true}
          highlightInitialDelay={500}
          initialHighlightData={[
            { end: 44, start: 20 },
            { end: 95, start: 70 },
          ]}
          lineSpace={5}
          lineBreakHeight={5}
          textColor={'black'}
          highlightedTextColor={'white'}
          highlightColor={'blue'}
          onHighlightStart={() => {
            console.log('hightStart');
          }}
          onHighlightEnd={(id) => {
            console.log('hightEnd', id);
          }}
          onHighlightTapped={(id, event) => {
            console.log('tapped', id, event);
          }}
          textStyle={{ fontSize: 15 }}
          backgroundColor="yellow"
          text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
        />
      </View>
  );
}
```

### Props

- `text` (string, required): The text content to display and enable highlighting.
- `textColor` (string): The color of the regular text.
- `highlightedTextColor` (string): The color of the highlighted text.
- `highlightColor` (string): The background color of the highlighted text.
- `lineBreakHeight` (number): The height of line breaks.
- `lineSpace` (number): The space between lines.
- `highlightInitialDelay` (number): Finger press initial delay before highlighting the text. Default is 150 (in milliseconds).
- `onHighlightStart` (function): Callback function when highlighting starts.
- `onHighlightEnd` (function): Callback function when highlighting ends.
- `initialHighlightData` (array of objects): An array specifying the initial highlight data, this is used to render text highlight initially
- `textStyle` (object): Custom styles for the text.
- `marginBottom` (number): Bottom margin for the text container.
- `margin` (number): The margin of the HighlightText component.
- `marginTop` (number): Top margin for the text container.
- `marginLeft` (number): Left margin for the text container.
- `marginRight` (number): Right margin for the text container.
- `onHighlightTapped` (function): Callback function when a highlighted section is tapped.
- `clearHighlightOnTap` (boolean): Clear highlighted sections on tap.

### Ref Functions

- `getHighlightData`: A ref function to retrieve the current highlighting data.
- `deleteHighlight`: A ref function to programmatically delete a highlighted area by its id.

## Example

For a complete example of how to use this package, please refer to the included example app.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

This package is open-source and available under the MIT License.
