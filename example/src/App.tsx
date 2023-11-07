import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HighlightText
          ref={highlightRef}
          clearHighlightOnTap={true}
          highlightInitialDelay={500}
          // initialHighlightData={[
          //   { end: 24, start: 10 },
          //   { end: 40, start: 30 },
          // ]}
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
          text={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
