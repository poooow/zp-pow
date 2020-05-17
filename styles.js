import { StyleSheet, Dimensions } from "react-native";
import Constants from 'expo-constants';

const textColor = '#555555';
const textColorLight = '#cccccc';
const backgroundColor = '#ffffff';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: '#ffffff',
  },
  item: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appState: {
    alignSelf: 'center',
    fontSize: 28,
    fontWeight: 'bold'
  },
  loadDb: {
    alignSelf: 'center',
    fontSize: 17,
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 15,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    padding: 10,
  },
  iconDownload: {
    alignSelf: "center",
    width: 100,
    height: 100,
    marginTop: 40,
    marginBottom: 20,
    padding: 20,
    borderRadius: 9999,
    backgroundColor: '#555',
  },
  songHeader: {
    flexDirection: 'row',
  },
  searchHeader: {
    flexDirection: 'row',
  },
  input: {
    maxWidth: Dimensions.get('window').width -60,
    fontSize: 17,
    paddingHorizontal: 16,
    marginLeft: 16,
    marginVertical: 16,
    height: 55,
    borderColor: "#888888",
    borderWidth: 1,
    borderRadius: 10,
    flexGrow: 1,
  },
  songHeaderTitle: {
    flexGrow: 1,
    paddingTop: 15,
  },
  songScrollView: {
    marginHorizontal: 10,
  },
  menuTrigger: {
    padding: 20,
    color: textColorLight,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  menuItem: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 15,
    color: textColor,
  },
});