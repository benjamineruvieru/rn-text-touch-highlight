import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { memo, useCallback, useMemo, useRef } from 'react';
//@ts-ignore
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  //@ts-ignore
} from 'react-native-reanimated';
import {
  findValueLessThanOrEqualToNumber,
  findIndexLessThanOrEqual,
} from './utilis/helper_functions';
import type { TextStyle, LayoutChangeEvent } from 'react-native';
import type { Ref } from 'react';
import type {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
  //@ts-ignore
} from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NO_WIDTH_SPACE = '​';

interface TextCompProps {
  word: string;
  i: number;
  addRange: (
    y: number,
    layout: { x: number; y: number; width: number; height: number },
    word: string
  ) => void;
  values: Animated.SharedValue<Array<{ start: number; end: number }>>;
  textColor: string;
  highlightedTextColor: string;
  highlightColor: string;
  lineBreakHeight?: number;
  lineSpace?: number;
  textStyle?: TextStyle;
  textBackgroundColor?: string;
}

const TextComp: React.FC<TextCompProps> = memo(
  ({
    word,
    i,
    addRange,
    values,
    textColor,
    highlightedTextColor,
    highlightColor,
    lineBreakHeight = 5,
    lineSpace = 2,
    textStyle,
    textBackgroundColor = 'transparent',
  }: TextCompProps) => {
    const derivedValue = useDerivedValue(() => {
      const map = values.value;
      let bgColor = textBackgroundColor;
      let color = textColor;
      for (let a = 0; a < map.length; a++) {
        const data = values.value[a];
        if (data.start === i) {
          bgColor = highlightColor;
          color = highlightedTextColor;
        }

        if (data.end >= i && data.start <= i) {
          bgColor = highlightColor;
          color = highlightedTextColor;
        }
      }
      return {
        ...textStyle,
        backgroundColor: bgColor,
        color,
        marginBottom: lineSpace,
      };
    });

    const animatedStyles = useAnimatedStyle(() => {
      return derivedValue.value;
    });
    const onLayout = useCallback((e: LayoutChangeEvent) => {
      const { y } = e.nativeEvent.layout;
      addRange(y, e.nativeEvent.layout, word);
    }, []);

    const styles = StyleSheet.create({
      view: { width: SCREEN_WIDTH, height: lineBreakHeight },
    });

    return word === '<br/>' ? (
      <View onLayout={onLayout} style={styles.view} />
    ) : (
      <Animated.Text onLayout={onLayout} style={[animatedStyles]}>
        <Text>{word} </Text>
        {NO_WIDTH_SPACE}
      </Animated.Text>
    );
  }
);

interface BreakTextProps extends Omit<TextCompProps, 'word' | 'i'> {
  words: string[];
}

const BreakText: React.FC<BreakTextProps> = ({
  words,
  addRange,
  values,
  textColor,
  highlightedTextColor,
  highlightColor,
  lineBreakHeight,
  lineSpace,
  textStyle,
  textBackgroundColor,
}) => {
  return (
    <>
      {words.map((word, i) => {
        return (
          <TextComp
            key={i}
            {...{
              word,
              i,
              addRange,
              values,
              textColor,
              highlightedTextColor,
              highlightColor,
              lineBreakHeight,
              lineSpace,
              textStyle,
              textBackgroundColor,
            }}
          />
        );
      })}
    </>
  );
};

interface HighlightTextProps
  extends Omit<BreakTextProps, 'addRange' | 'values' | 'words'> {
  /**
   * The text content to be displayed in the HighlightText component.
   */
  text: string;

  /**
   * Finger press delay before highlighting the text. Default is 150ms.
   */
  highlightInitialDelay?: number;

  /**
   * An array specifying the initial highlight data, this is used to render text highlight initially.
   */
  initialHighlightData?: Array<{ start: number; end: number }>;
  /**
   * The margin of the HighlightText component.
   */
  margin?: number;

  /**
   * The margin at the bottom of the HighlightText component.
   */
  marginBottom?: number;

  /**
   * The margin at the top of the HighlightText component.
   */
  marginTop?: number;

  /**
   * The margin at the left of the HighlightText component.
   */
  marginLeft?: number;

  /**
   * The margin at the right of the HighlightText component.
   */
  marginRight?: number;

  /**
   * A callback function triggered when the highlighting process starts.
   */
  onHighlightStart?: () => void;

  /**
   * A callback function triggered when the highlighting process ends.
   * It receives the id of the highlighted area as a parameter. This id can be used to delete the highlighted area.
   */
  onHighlightEnd?: (id: number) => void;

  /**
   * A callback function triggered when a highlighted region is tapped.
   * It receives the id of the tapped region and the event object.
   */
  onHighlightTapped?: (
    id: number,
    e: { absoluteX: number; absoluteY: number }
  ) => void;

  /**
   * If true, clears the highlight when a region is tapped.
   * Default is false.
   */
  clearHighlightOnTap?: boolean;
  /**
   * The backgroundColor of the HighlightText Component
   */
  backgroundColor?: string;
}

export interface HighlightTextRef {
  getHighlightedData: () => Array<{ start: number; end: number }>;
  deleteHighlight: (id: number) => void;
}

const HighlightText: React.ForwardRefExoticComponent<
  HighlightTextProps & React.RefAttributes<HighlightTextRef>
> = React.forwardRef(
  (
    {
      text,
      textColor,
      highlightedTextColor,
      highlightColor,
      lineBreakHeight,
      lineSpace,
      highlightInitialDelay = 150,
      onHighlightStart,
      onHighlightEnd,
      initialHighlightData = [],
      textStyle,
      marginBottom,
      marginTop,
      marginLeft,
      marginRight,
      onHighlightTapped,
      clearHighlightOnTap,
      margin,
      backgroundColor,
      textBackgroundColor,
    }: HighlightTextProps,
    ref: Ref<HighlightTextRef | null>
  ) => {
    const words = useMemo(() => text.split(' '), [text]);
    const layout = useSharedValue();
    const rangeMap = useSharedValue({});

    const start = useSharedValue();
    const values = useSharedValue(initialHighlightData);
    const prev = useSharedValue();
    const layoutDone = useRef(false);

    let map: Record<number, number[]> = {};
    let count = 0;

    function addRange(lowerBound: number, value: { x: number; width: number }) {
      'worklet';
      if (layoutDone.current) {
        map = {};
        count = 0;
        layoutDone.current = false;
      }
      const arr = map[lowerBound] ?? [];
      arr.push(value.x + value.width);
      map[lowerBound] = arr.sort((a, b) => a - b);
      count++;
      if (count >= words.length) {
        rangeMap.value = map;
        layoutDone.current = true;
      }
    }

    const calTap = (
      e: GestureStateChangeEvent<TapGestureHandlerEventPayload>
    ) => {
      'worklet';
      const keys = Object.keys(rangeMap.value);

      const { result, words } = findValueLessThanOrEqualToNumber(
        keys,
        e.absoluteY - layout.value.y,
        rangeMap.value
      );
      const i = findIndexLessThanOrEqual(
        rangeMap.value[result],
        e.absoluteX - layout.value.x
      );
      return { i, words };
    };

    const getHighlightedData = () => {
      return values.value;
    };
    const deleteHighlight = (id: number) => {
      values.value.splice(id, 1, { start: -1, end: -1 });
      values.value = [...values.value];
    };

    React.useImperativeHandle(ref, () => ({
      getHighlightedData,
      deleteHighlight,
    }));

    const tap = Gesture.Tap().onStart(
      (e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
        const { i, words } = calTap(e);
        for (let a = values.value.length - 1; a >= 0; a--) {
          const item = values.value[a];
          if (i + words >= item.start && i + words <= item.end) {
            if (clearHighlightOnTap) {
              runOnJS(deleteHighlight)(a);
            }
            runOnJS(onHighlightTapped)(a, e);
            break;
          }
        }
      }
    );

    const pan = Gesture.Pan()
      .activateAfterLongPress(highlightInitialDelay)
      .onStart((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
        runOnJS(onHighlightStart)();
        const { i, words } = calTap(e);
        start.value = i + words;
        prev.value = values.value;
        values.value = [...prev.value, { start: i + words, end: i + words }];
      })
      .onUpdate((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
        if (
          e.absoluteY >= layout.value.y &&
          e.absoluteX < layout.value.x + layout.value.width
        ) {
          const { i, words } = calTap(e);
          if (i + words < start.value) {
            values.value = [
              ...values.value.slice(0, values.value.length - 1),
              { start: i + words, end: start.value },
            ];
          } else {
            values.value = [
              ...values.value.slice(0, values.value.length - 1),
              { start: start.value, end: i + words },
            ];
          }
        }
      })
      .onEnd(() => {
        runOnJS(onHighlightEnd)(values.value.length - 1);
      });

    const composed = Gesture.Race(tap, pan);

    const styles = StyleSheet.create({
      mainViewStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin,
        marginBottom,
        marginTop,
        marginLeft,
        marginRight,
        backgroundColor,
      },
    });
    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        layout.value = e.nativeEvent.layout;
      },
      [layout]
    );
    return (
      <GestureDetector gesture={composed}>
        <View style={styles.mainViewStyle} onLayout={onLayout}>
          <BreakText
            {...{
              words,
              addRange,
              values,
              textColor,
              highlightedTextColor,
              highlightColor,
              lineBreakHeight,
              lineSpace,
              textStyle,
              textBackgroundColor,
            }}
          />
        </View>
      </GestureDetector>
    );
  }
);

export default HighlightText;
