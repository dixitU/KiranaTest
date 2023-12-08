/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import axios from 'axios';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import lodash from 'lodash';
import {SwipeListView} from 'react-native-swipe-list-view';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {rootStore} from './models';

const width = Dimensions.get('window').width;

type News = {
  title: String;
  description: String;
  urlToImage: String;
  publishedAt: String;
  view: Number;
  pin: Number;
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [key, setKey] = useState('flatListKey');
  const [pinData, setPinData] = useState([]);
  const [data, setData] = useState([]);
  const [topData, setTopData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  let timeout: any = useRef(null);

  const country = 'in';
  const category = 'business';
  const apiKey = 'efae34c7af2e4d16b6f52d2441d7890d';

  const backgroundStyle = {
    backgroundColor: '#fff',
    flex: 1,
  };

  useEffect(() => {
    axios
      .get(
        `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
      )
      .then(async (res: any) => {
        console.log('res--->', res.data.articles.length);
        const articales = await res.data.articles.map((e: any) => {
          return {
            title: e.title,
            description: e.description || '',
            urlToImage: e.urlToImage || '',
            publishedAt: e.publishedAt,
            view: 0,
            pin: 0,
          };
        });
        rootStore.setNews(articales);
        getTopData();
      })
      .catch((e: any) => console.log('error', e));
  }, []);

  const getTopData = async () => {
    const pinnedNews: any = await rootStore.news.filter(
      (e: any) => e.pin === 1,
    );
    const unpinnedNews: any = rootStore.news.filter((e: any) => e.pin !== 1);
    const filteredNews: any[] =
      (await unpinnedNews.slice(5).filter((e: any) => e.view === 0)) || [];
    if (filteredNews.length > 0) {
      setPinData(pinnedNews);
      // setData(unpinnedNews.slice(0, 5));
      setTopData(lodash.sampleSize(filteredNews, 5));
      setData([
        ...pinnedNews,
        ...lodash.sampleSize(filteredNews, 5),
        ...unpinnedNews.slice(0, 5),
      ]);
    } else {
      setData([...pinnedNews, ...unpinnedNews.slice(0, 5)]);
      setTopData([]);
    }
    clearInterval(timeout.current);
    timeout.current = setInterval(async () => {
      const pinnedNew: any = await rootStore.news.filter(
        (e: any) => e.pin === 1,
      );
      const unpinnedNew: any = rootStore.news.filter((e: any) => e.pin !== 1);
      const filteredNew: any[] =
        (await unpinnedNew.slice(5).filter((e: any) => e.view === 0)) || [];
      if (filteredNew.length > 0) {
        setPinData(pinnedNew);
        // setData(unpinnedNew.slice(0, 5));
        setTopData(lodash.sampleSize(filteredNew, 5));
        setData([
          ...pinnedNew,
          ...lodash.sampleSize(filteredNew, 5),
          ...unpinnedNew.slice(0, 5),
        ]);
      } else {
        setData([...pinnedNew, ...unpinnedNew.slice(0, 5)]);
        setTopData([]);
      }
    }, 10000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getTopData();
    setIsRefreshing(false);
  };

  const onPressPin = (rowData: any, rowMap: any) => {
    // console.log('data', rowMap);
    rowMap[rowData.item.title]?.closeRow();
    rowData.item.newsPin();
    setKey(Math.random().toString());
  };

  const onPressDelete = (rowData: any, rowMap: any) => {
    // console.log('data', rowMap);
    rowMap[rowData.item.title]?.closeRow();
    rootStore.deleteNews(rowData.item.title);
    // getTopData();
    const newData = data.filter((e: any) => e.title !== rowData.item.title);
    setData(newData);
    setKey(Math.random().toString());
  };

  const renderItem = ({item, index}: any) => {
    return (
      <View
        style={styles.articalContainer}
        key={item.title}
        onLayout={() =>
          rootStore.news.find((e: any) => e.title === item.title)?.updateView()
        }>
        {item.pin === 1 ? (
          <View style={styles.pinTextContainer}>
            <Text style={styles.pinText}>Pin</Text>
          </View>
        ) : null}
        {item.urlToImage !== '' ? (
          <Image
            source={{
              uri: item.urlToImage,
            }}
            style={styles.newImage}
          />
        ) : null}
        <View style={{width: width * 0.7 - 30}}>
          <Text style={styles.titleText} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.discriptionText} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <SwipeListView
        key={key}
        refreshing={isRefreshing}
        onRefresh={() => handleRefresh()}
        data={data.sort((a: any, b: any) => b.pin - a.pin)}
        renderItem={renderItem}
        renderHiddenItem={(rowData: any, rowMap: any) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={styles.pinContainer}
              onPress={() => onPressPin(rowData, rowMap)}>
              <Text style={{color: '#fff'}}>Pin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteContainer}
              onPress={() => onPressDelete(rowData, rowMap)}>
              <Text style={{color: '#fff'}}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-150}
        keyExtractor={(item: any) => item.title}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  newImage: {
    width: width * 0.3,
    // height: width,
    aspectRatio: 1.91,
    resizeMode: 'contain',
    marginRight: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  discriptionText: {
    fontSize: 12,
    color: '#000',
  },
  articalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    width: width - 20,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderBottomColor: '#C5CDD2',
    backgroundColor: '#fff',
  },
  rowBack: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#DDD',
    flex: 1,
    width: 150,
    flexDirection: 'row',
    // paddingLeft: 15,
    marginHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  pinContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinTextContainer: {
    backgroundColor: '#FED300',
    padding: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    position: 'absolute',
    zIndex: 999,
    top: 10,
  },
  pinText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default App;
