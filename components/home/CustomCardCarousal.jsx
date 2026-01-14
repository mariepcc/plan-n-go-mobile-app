import React, { useEffect, useRef, useState } from "react";
import { View, useWindowDimensions, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import CustomCard from "./CustomCard";
import Pagination from "./Pagination";
import { useRouter, Link } from "expo-router";

const CustomCardCarousal = ({ data, userId, autoPlay, pagination }) => {
  const scrollViewRef = useAnimatedRef(null);
  const interval = useRef();
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const [newData, setNewData] = useState([
    { key: "spacer-left" },
    ...data,
    { key: "spacer-right" },
  ]);
  const { width } = useWindowDimensions();
  const SIZE = width * 0.7;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const offSet = useSharedValue(0);
  const targetX = useSharedValue(0);
  const router = useRouter();

  useEffect(() => {
    setNewData([{ key: "spacer-left" }, ...data, { key: "spacer-right" }]);
  }, [data]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      offSet.value = e.contentOffset.x;
    },
  });

  useDerivedValue(() => {
    targetX.value =
      offSet.value >= Math.floor(SIZE * (data.length - 1) - 10)
        ? 0
        : Math.floor(offSet.value + SIZE);
  });

  useEffect(() => {
    if (isAutoPlay === true) {
      interval.current = setInterval(() => {
        scrollViewRef.current.scrollTo({ x: targetX.value, y: 0 });
      }, 2000);
    } else {
      clearInterval(interval.current);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [isAutoPlay, scrollViewRef]);

  return (
    <View>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          setIsAutoPlay(false);
        }}
        onMomentumScrollEnd={() => {
          setIsAutoPlay(autoPlay);
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SIZE}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        {newData.map((item, index) => {
          if (item.key === "spacer-left" || item.key === "spacer-right") {
            return <View key={item.key + index} style={{ width: SPACER }} />;
          }

          return (
            <Link
              key={item.id || index}
              href={{
                pathname: `/home/${item.id}`,
                params: { title: item.title, userId: userId}
              }}
              asChild
            >
              <TouchableOpacity activeOpacity={0.8}>
                <CustomCard
                  index={index}
                  item={item}
                  x={x}
                  size={SIZE}
                  spacer={SPACER}
                />
              </TouchableOpacity>
            </Link>
          );
        })}
      </Animated.ScrollView>

      {pagination && <Pagination data={data} x={x} size={SIZE} />}
    </View>
  );
};

export default CustomCardCarousal;

