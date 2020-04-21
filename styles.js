import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

export default StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 17,
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
    marginHorizontal: 16,
    marginVertical: 16,
    height: 55,
    borderColor: "#888888",
    borderWidth: 1,
    borderRadius: 10,
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
  songHeaderTitle: {
    flexGrow: 1,
    paddingTop: 15,
  },
  songScrollView: {
    marginHorizontal: 10,
  }
});