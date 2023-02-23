import TermsCoButton from "./TermsCoButton";
import { ScrollView } from "react-native";

function TermsCoScreen({
  navigation,
  route: {
    params: { setTnC, setAccepted, setTncErrMsg },
  },
}) {
  // const container = { flex: 1, backgroundColor: "white", padding: 50};
  return (
    <TermsCoButton
      navigation={navigation}
      setTnC={setTnC}
      setAccepted={setAccepted}
      setTncErrMsg={setTncErrMsg}
    />
  );
}

export default TermsCoScreen;
