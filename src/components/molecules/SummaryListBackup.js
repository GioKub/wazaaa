// import React from "react";
// import { SafeAreaView } from "react-native";
// import { FlatList, Text, View } from "react-native";
// import BootstrapStyleSheet from "react-native-bootstrap-styles";
// import SummaryListItem from "../atoms/SummaryListItem.js";

// const bootstrapStyleSheet = new BootstrapStyleSheet();
// const { s, c } = bootstrapStyleSheet;

// const SummaryList = ({ parcels, discounts }) => {
//   // console.log(discounts, "a2312321");
//   // console.log(parcels, "<-SummaryList.js");
//   const renderItem = ({ item, index }) => {
//     const { price, ...parcel } = item;
//     let totalPrice = price;
//     let discount = 0;
//     if (parcel.extra_charges)
//       parcel.extra_charges.map(
//         (extra) => (totalPrice += parseFloat(extra.amount))
//       );
//     if (discounts[index]) discount = discounts[index];

//     return (
//       <View style={[s.tableRow]}>
//         <View style={[s.tableHeadCol, { justifyContent: "center" }]}>
//           <Text style={[s.text]}>{index + 1}</Text>
//         </View>
//         <View style={[s.tableHeadCol, s.flex12]}>
//           <SummaryListItem
//             parcel={parcel}
//             price={totalPrice}
//             discount={discount}
//           />
//         </View>
//       </View>
//     );
//   };
//   return (
//     <>
//       <SafeAreaView style={{ flex: 1 }}>
//         <FlatList
//           data={parcels}
//           style={[s.table]}
//           ListHeaderComponent={Header}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//         />
//       </SafeAreaView>
//     </>
//   );
// };

// const Header = () => {
//   return (
//     <View style={[s.tableHead]}>
//       <View style={[s.tableHeadCol]}>
//         <Text style={[s.text]}>#</Text>
//       </View>
//       <View style={[s.tableHeadCol, s.flex12]}>
//         <Text style={[s.text]}>Parcel</Text>
//       </View>
//     </View>
//   );
// };
// export default SummaryList;
