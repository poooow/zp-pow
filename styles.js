import { StyleSheet } from "react-native";
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
    fontSize: 30,
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
  input: {
    fontSize: 17,
    padding: 16,
    marginLeft: 16,
    marginVertical: 16,
    height: 55,
    borderColor: "#888888",
    borderWidth: 1,
    borderRadius: 10,
    flexGrow: 1,
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
    margin: 20,
  },
  songHeader: {
    flexDirection: 'row',
  },
  searchHeader: {
    flexDirection: 'row',
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