import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
// components from "../scenes/afterlogin/agent/"
import HomeScreen from "../scenes/afterLogin/agent/home/HomeScreen.js";
import SearchScreen from "../scenes/afterLogin/agent/home/SearchScreen.js";
import EditParcel from "../scenes/afterLogin/agent/edit-parcel/EditParcel.js";
import EditUser from "../scenes/afterLogin/agent/edit-parcel/EditUser.js";
import PickupItemScreen from "../scenes/afterLogin/agent/pickup-item/PickupItemScreen.js";
import AddReciever from "../scenes/afterLogin/agent/pickup-item/AddReciever.js";
import ItemProcessing from "../scenes/afterLogin/agent/item-processing/ItemProcessing.js";
import ItemProcessingScanner from "../scenes/afterLogin/agent/item-processing/ItemProcessingScanner.js";
import Scanner from "../scenes/afterLogin/agent/item-processing/Scanner.js";
import BookScanner from "../scenes/afterLogin/agent/item-processing/BookScanner.js";
import ItemModes from "../scenes/afterLogin/agent/item-processing/ItemModes.js";
import DeliveredItemProcessing from "../scenes/afterLogin/agent/item-processing/DeliveredItemProcessing.js";
import ExtraCharges from "../scenes/afterLogin/agent/edit-parcel/ExtraCharges.js";
import PrivilegeScreen from "../scenes/afterLogin/admin/PriviledgeScreen.js";
import ReleaseSingatureScreen from "../scenes/afterLogin/agent/signature/ReleaseSignatureScreen.js";
import DeliverSignatureScreen from "../scenes/afterLogin/agent/signature/DeliverSignatureScreen.js";
import BookingScreen from "../scenes/afterLogin/agent/booking/BookingScreen.js";
// componenets from "../scenes/beforeLogin/"
import LoginScreen from "../scenes/beforeLogin/login/LoginScreen.js";
import SignupScreen from "../scenes/beforeLogin/singup/SignupScreen.js";
import ResetPasswordScreen from "../scenes/beforeLogin/resetPassword/ResetPasswordScreen.js";
// components from "../scenes/afterlogin/client/"
import ChangePasswordScreen from "../scenes/afterLogin/client/ChangePasswordScreen.js";
import UpdateCustomerScreen from "../scenes/afterLogin/client/UpdateCustomerScreen.js";
import PaymentsScreen from "../scenes/afterLogin/client/PaymentsScreen.js";
import ClientBookingsScreen from "../scenes/afterLogin/client/ClientBookingsScreen.js";
import BookCourierScreen from "../scenes/afterLogin/client/BookCourierScreen.js";
import TermsCoScreen from "../scenes/afterLogin/client/termsCoScreen.js";
import BookFromUKScreen from "../scenes/afterLogin/client/BookFromUKScreen.js";
import BookFromIEScreen from "../scenes/afterLogin/client/BookFromIEScreen.js";
import UpdateCustomerAddressScreen from "../scenes/afterLogin/client/UpdateCustomerAddressScreen.js";
import TestBooking from "../scenes/afterLogin/client/test/TestBooking.js";
// rest of the components
import Summary from "../scenes/afterLogin/agent/summary/Summary.js";
import { AuthContext } from "../context/index.js";
import CustomerNavigator from "./CustomerNavigator.js";

const { Navigator, Screen } = createStackNavigator();

const App = () => {
  const { auth, setAuth } = useContext(AuthContext);

  // logic: if user is logged in and it has some privileges granted and id set to 1
  // then it means it is admin so render admin screen, otherwiser if user has priviledges
  // but id is other number then 0 it means he is agent so render agent screen, otherwiser
  // if user doesn't have priviledeges at all it means he is client so render client screen..
  // if user is not logged in render login, register and reset passwrod screen.
  return (
    <NavigationContainer>
      {auth.is_logged_in ? (
        auth.agent.hasOwnProperty("privileges") ? (
          <Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Screen name="Home" component={HomeScreen} />
            <Screen name="Edit Parcel" component={EditParcel} />
            {/* screns for Edit Sender and Edit Reciever are the same */}
            <Screen name="Edit Sender" component={EditUser} />
            <Screen name="Edit Receiver" component={EditUser} />
            {/* this screen renders when you click 'Pickup Items' button inside HomeScreen.js */}
            <Screen name="Add Sender" component={PickupItemScreen} />
            {/* gets called when you click 'Summary; button inside AddReciever.js */}
            <Screen name="Summary" component={Summary} />
            {/* this renders when you click 'Add Parcel' button inside PickupItemScreen.js */}
            <Screen name="Add Parcel" component={AddReciever} />
            {/* gets called when you click 'Item Processing; button inside HomeScreen.js */}
            <Screen name="Item Processing" component={ItemProcessing} />
            <Screen name="Scanner" component={ItemProcessingScanner} />
            {/* this screen render when you click 'Scan' button inside AddReciver.js */}
            <Screen name="cameraScanner" component={Scanner} />
            <Screen name="BookScanner" component={BookScanner} />
            <Screen name="Modes" component={ItemModes} />
            {/* gets called when you click "Search" button inside HomeSCreen.js */}
            <Screen name="Search" component={SearchScreen} />
            <Screen name="ExtraCharges" component={ExtraCharges} />
            <Screen
              name="Delivered Item Processing"
              component={DeliveredItemProcessing}
            />
            <Screen
              name="ReleaseSignScreen"
              component={ReleaseSingatureScreen}
            />
            <Screen
              name="DeliverSignScreen"
              component={DeliverSignatureScreen}
            />
            <Screen name="BookingScreen" component={BookingScreen} />
          </Navigator>
        ) : (
          // user is logged in but has no priviledges
          <Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Screen name="customerNavigator" component={CustomerNavigator} />
            <Screen
              name="ChangePasswordScreen"
              component={ChangePasswordScreen}
            />
            <Screen
              name="UpdateCustomerScreen"
              component={UpdateCustomerScreen}
            />
            <Screen name="PaymentsScreen" component={PaymentsScreen} />
            <Screen name="ClientBookings" component={ClientBookingsScreen} />
            <Screen name="BookCourier" component={BookCourierScreen} />
            <Screen name="TermsCoScreen" component={TermsCoScreen} />
            <Screen name="UKScreen" component={BookFromUKScreen} />
            <Screen name="IEScreen" component={BookFromIEScreen} />
            <Screen
              name="UpdateCustAddr"
              component={UpdateCustomerAddressScreen}
            />
            <Screen name="TestBooking" component={TestBooking} />
          </Navigator>
        )
      ) : (
        // user is not logged in
        <Navigator>
          <Screen name="Login" component={LoginScreen} />
          <Screen name="Signup" component={SignupScreen} />
          <Screen name="Reset Password" component={ResetPasswordScreen} />
        </Navigator>
      )}
    </NavigationContainer>
  );
};
export default App;
