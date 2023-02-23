import React, { Component, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const TermsCoButton = ({
  navigation,
  setTnC,
  setAccepted: setAcc,
  setTncErrMsg,
}) => {
  const [accepted, setAccepted] = useState(false);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms and Conditions of carriage</Text>
      <Text style={styles.title}>გადაზიდვის წესები და პირობები</Text>
      <ScrollView
        style={styles.tcContainer}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setAccepted(true);
          }
        }}
      >
        <Text style={styles.tcP}>IMPORTANT NOTICE</Text>
        <Text style={styles.tcP}>
          When ordering Georgian Cargo’s (bellow known as ‘GC’) services you, as
          “Shipper”, are agreeing, on your behalf and on behalf of the receiver
          of the Shipment (“Receiver”) and anyone else with an interest in the
          Shipment that these Terms and Conditions shall apply.
        </Text>
        <Text style={styles.tcL}>
          1. Customs Clearance{"\n"} GC may perform any of the following
          activities on Shipper’s or Receiver’s behalf in order to provide its
          services: {"\n"}(1) complete any documents, amend product or service
          codes, and pay any duties, taxes or penalties required under
          applicable laws and regulations (“Customs Duties”), {"\n"}(2) act as
          Shipper’s forwarding agent for customs and export control purposes and
          as Receiver solely for the purpose of designating a customs broker to
          perform customs clearance and entry and {"\n"}(3) redirect the
          Shipment to Receiver’s customs broker or other address upon request by
          any person who GC believes in its reasonable opinion to be authorized.
        </Text>
        <Text style={styles.tcL}>
          2. Unacceptable Shipments {"\n"}A Shipment is deemed unacceptable if:
          {"\n"}• no customs declaration is made when required by applicable
          customs regulations, {"\n"}• it contains counterfeit goods, animals,
          bullion, currency, gem stones; weapons, explosives and ammunition;
          human remains; illegal items, such as ivory and narcotics, {"\n"} • it
          is classified as hazardous material, dangerous goods, prohibited or
          restricted articles by IATA (International Air Transport Association),
          ICAO (International Civil Aviation Organization), ADR (European Road
          Transport Regulation on dangerous goods) or other relevant
          organization (“Dangerous Goods”), Please see photo attached. {"\n"} •
          its address is incorrect or not properly marked or its packaging is
          defective or inadequate to ensure safe transportation with ordinary
          care in handling, {"\n"} • it contains any other item which GC decides
          cannot be carried safely or legally. {"\n"}• Any shipment found with
          undeclared dangerous goods or hazardous materials could be a subject
          of penalty charge of £50.00. Also, illegal items found such as such as
          ivory and narcotics, could be a subject of criminal investigation.
        </Text>
        <Text style={styles.tcL}>
          3. Deliveries and Undeliverables {"\n"}Shipments cannot be delivered
          to PO boxes or postal codes. Shipments are delivered to the Receiver’s
          address given by Shipper but not necessarily to the named Receiver
          personally. Shipments to addresses with a central receiving area will
          be delivered to that area.
          {"\n"}
          GC may notify Receiver of an upcoming delivery or a missed delivery.
          Receiver may be offered alternative delivery options such as delivery
          on another day, no signature required, redirection or collection at a
          GC Service Point. Shipper may exclude certain delivery options on
          request.
        </Text>
        <Text style={styles.tcL}>
          4. Inspection {"\n"} GC has the right to open and inspect a Shipment
          without notice for safety, security, customs or other regulatory
        </Text>
        <Text style={styles.tcL}>
          5. Shipment Charges and Fees{"\n"} GC’s Shipment charges are
          calculated according to the higher of actual or volumetric weight per
          piece and any piece may be re-weighed and re-measured by GC to confirm
          this calculation.{"\n"}
          Shipper, or the Receiver when GC acts on Receiver’s behalf, shall pay
          or reimburse GC for all Shipment or other charges due, or Customs
          Duties owed for services provided by GC or incurred by GC on Shipper’s
          or Receiver’s behalf. Payment of Customs Duties will be requested
          prior to delivery. Parcel will not be released by GC before the
          customs declaration been accepted by
        </Text>
        <Text style={styles.tcL}>6. GC’s Liability</Text>
        <Text style={styles.tcL}>
          6.1 GC’s liability in respect of any one Shipment transported by air
          (including ancillary road transport or stops en route) is limited by
          the Montreal Convention or the Warsaw Convention as applicable. If
          Shipper regards these limits as insufficient it must make a special
          declaration of value and request insurance as described in Section 8
          or make its own insurance arrangements. GC’s liability is strictly
          limited to direct loss and damage to a Shipment only. All other types
          of loss or damage are excluded, whether such loss or damage is special
          or indirect, and even if the risk of such loss or damage was brought
          to GC’s attention.
        </Text>
        <Text style={styles.tcL}>
          6.2 GC will make every reasonable effort to deliver the Shipment
          according to GC’s regular delivery schedules, but these schedules are
          not binding and do not form part of the contract. GC is not liable for
          any damages or loss caused by delay.
        </Text>
        <Text style={styles.tcL}>
          7. Claims {"\n"}All claims must be submitted in writing by filling the
          Claim Form to GC within thirty (30) days from the date that GC
          accepted the Shipment, failing which GC shall have no liability
          whatsoever. Claims are limited to one claim per Shipment, settlement
          of which will be full and final settlement for all loss or damage in
          connection therewith.
        </Text>
        <Text style={styles.tcL}>
          8. Shipment {"\n"} Insurance GC may be able to arrange insurance
          covering the value in respect of loss of or damage to the Shipment,
          provided that the Shipper so instructs GC in writing, and pays the
          applicable premium. Shipment insurance does not cover indirect loss or
          damage, or loss or damage caused by delays. If Shipper requires
          greater protection, then insurance may be arranged at an additional
          cost with appropriate T&C.
        </Text>
        <Text style={styles.tcL}>
          9. Circumstances Beyond GC’s Control{"\n"} GC is not liable for any
          loss or damage arising out of circumstances beyond GC’s control. These
          include but are not limited to electrical or magnetic damage to, or
          erasure of, electronic or photographic images, data or recordings; any
          defect or characteristic related to the nature of the Shipment, even
          if known to GC; any act or omission by a person not employed or
          contracted by GC- e.g. Shipper, Receiver, third party, customs or
          other government official; “Force Majeure” - e.g. earthquake, cyclone,
          storm, flood, fog, war, plane crash, embargo, riot, civil commotion,
          or industrial action.
        </Text>
        <Text style={styles.tcL}>
          10. Shipper’s Warranties and Indemnities{"\n"}
          Shipper shall indemnify and hold GCharmless for any loss or damage
          arising out of Shipper’s failure to comply with the following
          warranties and representations:{"\n"} • all information provided by
          Shipper or its representatives is complete and accurate; {"\n"}• the
          Shipment is acceptable for transport under Section 2 above;{"\n"} •
          the Shipment was prepared in secure premises by reliable persons and
          was protected against unauthorized interference during preparation,
          storage and any transportation to GC;{"\n"} • Shipper has obtained all
          necessary consents in relation to personal data provided to GC
          including Receiver’s data as may be required for transport, customs
          clearance and delivery, such as e-mail address and mobile phone
          number. Further information is available on the GC website
          (www.georgiancargo.co.uk) or from GC Customer Service.
        </Text>
        <Text style={styles.tcP}>
          Carrier's Responsibility: Ocean Transport
        </Text>
        <Text style={styles.tcL}>
          1. Where the Carriage is Ocean Transport, the Carrier undertakes to
          perform and/or in his own name to procure performance of the Carriage
          from the Port of Loading to the Port of Discharge. The liability of
          the Carrier for loss of or damage to the Goods occurring between the
          time of acceptance by the Carrier of custody of the Goods at the Port
          of Loading and the time of the Carrier tendering the Goods for
          delivery at the Port of Discharge shall be determined in accordance
          with Articles 1-8 of the Hague Rules save as is otherwise provided in
          these Terms and Conditions. These articles of the Hague Rules shall
          apply as a matter of contract.
        </Text>
        <Text style={styles.tcL}>
          2. The Carrier shall have no liability whatsoever for any loss or
          damage to the Goods, howsoever caused, if such loss or damage arises
          before acceptance by the Carrier of custody of the Goods or after the
          Carrier tendering the cargo for delivery. Notwithstanding the above,
          to the extent any applicable compulsory law provides to the contrary,
          the Carrier shall have the benefit of every right, defence, limitation
          and liberty in the Hague Rules as applied by clause 5.1 during such
          additional compulsory period of responsibility, notwithstanding that
          the loss or damage did not occur at sea.
        </Text>
        <Text style={styles.tcL}>
          3. Where US COGSA applies then the provisions stated in the said Act
          shall govern during Carriage to or from a container yard or container
          freight station at the Port of Loading before loading on the vessel or
          at the Port of Discharge before delivery to an inland carrier.
        </Text>
        <Text style={styles.tcL}>
          4. If the Carrier is requested by the Merchant to procure Carriage by
          an inland carrier and the inland carrier in his discretion agrees to
          do so, such Carriage shall be procured by the Carrier as agent only to
          the Merchant and Carrier shall have no liability for such carriage or
          the acts or omissions of such inland carrier.
        </Text>
        <Text style={styles.tcL}>
          5. Compensation and Liability Provisions Subject always to the
          Carrier’s right to limit liability as provided for herein, if the
          Carrier is liable for compensation in respect of loss of or damage to
          the Goods, such compensation shall be calculated by reference to the
          value of the Goods plus Freight and insurance if paid. The value of
          the Goods shall be determined with reference to the commercial
          invoice, customs declaration, any prevailing market price (at the
          place and time they are delivered or should have been delivered),
          production price or the reasonable value of Goods of the same kind
          and/or quality.
        </Text>
        <Text style={styles.tcL}>
          6. The Carrier’s liability shall in no event exceed 2 SDR per kilo of
          the gross weight of the Goods lost, damaged or in respect of which a
          claim of whatsoever nature arises . The Carrier does not undertake
          that the Goods or any documents relating thereto shall arrive or be
          available at any point or place at any stage during the Carriage or at
          the Port of Discharge or the Place of Delivery at any particular time
          or to meet any particular requirement of any license, permission, sale
          contract, or credit of the Merchant or any market or use of the Goods
          and the Carrier shall under no circumstances whatsoever and howsoever
          arising be liable for any direct, indirect or consequential loss or
          damage caused by delay. If the Carrier should nevertheless be held
          legally liable for any such direct or indirect or consequential loss
          or damage caused by delay, such liability shall in no event exceed the
          Freight paid. Save as is otherwise provided herein, the Carrier shall
          in no circumstances be liable for direct or indirect or consequential
          loss or damage arising from any other cause whatsoever or for loss of
          profits. Once the Goods have been received by the Carrier for Carriage
          the Merchant shall not be entitled neither to impede, delay, suspend
          or stop or otherwise interfere with the Carrier’s intended manner of
          performance of the Carriage or the exercise of the liberties conferred
          by this bill of lading nor to instruct or require delivery of the
          Goods at other Port or Place than the Port of Discharge or Place of
          Delivery named on the reverse hereof or such other Port or Place
          selected by the Carrier in the exercise of the liberties herein, for
          any reason whatsoever. The Merchant shall indemnify the Carrier
          against all claims, liabilities, losses, damages, costs, delays,
          attorney fees and/or expenses caused to the Carrier, his
          Subcontractors, servants or agents or to any other cargo or to the
          owner of such cargo during the Carriage arising or resulting from any
          impediment, delay, suspension, stoppage or interference whatsoever in
          the Carriage of the Goods.
        </Text>
        <Text style={styles.tcL}>
          7. No representation is made by the Carrier as to the weight,
          contents, measure, quantity, quality, description, condition, marks,
          numbers or value of the Goods and the Carrier shall be under no
          responsibility whatsoever in respect of such description or
          particulars. The Shipper also warrants that the Goods are lawful
          goods, and contain no contraband, drugs or other illegal substances or
          stowaways, and that the Goods will not cause loss, damage or expense
          to the Carrier, or to any other cargo.
        </Text>
        <Text style={styles.tcL}>
          8. The Merchant shall comply with all regulations or requirements of
          customs, port and other authorities, and shall bear and pay all
          duties, taxes, fines, imposts, expenses or losses (including, without
          prejudice to the generality of the foregoing Freight for any
          additional Carriage undertaken) incurred or suffered by reason of any
          failure to so comply, or by reason of any illegal, incorrect or
          insufficient declaration, marking, numbering or addressing of the
          Goods, and shall indemnify the Carrier in respect thereof. If
          Containers supplied by or on behalf of the Carrier are unpacked by or
          for the Merchant, the Merchant is responsible for returning the empty
          Containers, with interiors clean, odour free and in the same condition
          as received, to the point or place designated by the Carrier, within
          the time prescribed. Should a Container not be returned in the
          condition required and/or within the time prescribed in the Tariff,
          the Merchant shall be liable for any detention, loss or expense
          incurred as a result thereof. Merchants are deemed to be aware of the
          dimensions and capacity of any Containers released to them.
        </Text>
        <Text style={styles.tcP}>მნიშვნელოვანი გაფრთხილება</Text>
        <Text style={styles.tcP}>
          როდესაც ვუკვეთავთ ჯორჯიან კარგოს სერვისებს, მომხმარებელი - შემდეგში
          მოხსენიებული როგორც ,,გამომგზავნი” შენ ეთანხმები წესებს, ,,მიმღების”
          სახელითაც და ნებისმიერი სხვა პირის სახლით რომელიც ამ ამ გადსაზიდვაში
          იქნება დაკავშირებული, ყველა მათგანზე იმოქმედებს აღნიშნული წესები
          დაპირობები.
        </Text>
        {/* {"\n"} • */}
        <Text style={styles.tcL}>
          1. საბაჟო პროცედურები {"\n"}იმისათვის რომ განახორციელოს სერვისი
          ჯორჯიან კარგომ გამომგზანისა და მიმღების სახელით შესაძლოა განახორციელოს
          შემგეგი პქროცედურები:{"\n"} (1) შესავსოს დოკუმენტები, შეცვალოს
          პროდუქტის ან სერვისის კოდები, გადაიხადოს ჯარიმები და გადასახადები და
          კანონის მიერ გათვალისწინებული სხვა გადასახადები.{"\n"} (2) იმოქმედიოს
          როგორც გამგზავნის გადამზიდმა აგენტმა საბაჟო და ექპორტის შემოწმების
          მიზნით, როგორც მიმღებმა მხოლოდ და მხოლოდ საბაჟო პროცედურების და
          დოკუმენტაციის შედგენის მიზნით და{"\n"} (3) მიუჩინოს საბაჟო
          პროცედურების შემსრულებლად პირი, რომელსაც ჯორჯიან კარგო მიიჩნევს
          ავტორიზებულ პირად.
        </Text>
        <Text style={styles.tcL}>
          2. უარი გადაზიდვაზე Გადაზიდვა
          {"\n"}შესაძლოა არ განხორციელდეს იმ შემთხვევაში თუკი:
          {"\n"}• არ არის დამზადებული დეკლარაცია საბაჟო რეგულაციით განსაზღვრულ
          ვადებში.
          {"\n"}• ის შეიცავს აკრძალულ ნივთებს: ცხოველებს, ბუილონს, კუპიურებს,
          ძვირფას ქვებს, იარაღს, ასაფეთქებელი ნივთიერებებსა და საბრძოლო
          მასალებს; ადამიანის ნეშტს; უკანონო საგნებს, როგორიცაა სპილოს
          ძვირფასეულობა და ნარკოტიკული საშუალებებს.
          {"\n"}• იგი კლასიფიცირდება როგორც საშიში მასალა, საშიში საქონელი,
          IATA- ს (საჰაერო ტრანსპორტის საერთაშორისო ასოციაცია), ICAO- ს
          (სამოქალაქო ავიაციის საერთაშორისო ორგანიზაცია), ADR (საავტომობილო
          ტრანსპორტის შესახებ ევროპული რეგულაცია საშიში საქონლის შესახებ) ან
          სხვა შესაბამისი ორგანიზაციის მიერ აკრძალული ან შეზღუდული საგნები.
          {"\n"}• მისი მისამართი არასწორია, ან არ არის სათანადოდ მონიშნული, ან
          მისი შეფუთვა არასწორი ან არასაკმარისია, რათა უზრუნველყოს უსაფრთხო
          ტრანსპორტირება.
          {"\n"}• ის შეიცავს ნებისმიერ სხვა ნივთს, რომლის ჯორჯიან კარგოს
          გადაწყვეტილებით არ შეიძლება უსაფრთხოდ ან ლეგალურად ტრანსპორტირებულ
          იქნეს. Თუ ამანათში აღმოჩნდება არადეკლარირებული სახიფათო საქონელი ან
          აკრძალული მასალები, მსგავსი შემთხვევა დაექვემდებარება ჯარიმას 50.00
          ფუნტი სტერლინგით. ასევე, სისხლის სამართლის გამოძიების საგანი შეიძლება
          იყოს უკანონო საგნები, როგორიცააძვურფასეულობისდა და ნარკოტიკული
          საშუალებების აღმოჩენა.
        </Text>
        <Text style={styles.tcL}>
          3. ამანათის მიწოდება {"\n"}ამანათის მიწოდება არ ხდება საფოსტო ყუთებში
          დატოვებით, ამანათის გადაცემა ხდება გამომგზავნის მიერ მითითებულ
          მისამართზე, თუმცა შესაძლოა ამანათი გადაეცეს არა ზუსტად მის მიერ
          მითიღებულ მიმღებს. კომპანიამ შესაძლოა შეატყობინოს მიმღებს ამანათის
          მოსალოდნელი ჩაბარების დროის ან ამ დროის შეცვლის შესახებ. თუ ამანათის
          ჩაბარება ვერ ხერხდება კონკრეტულ დღეს, შესაძლებელია შეთანხმდეს მომდევნო
          დღეს. ანათის ჩაბარებისას კომპანია არ მოითხოვს ხელმოწერას.
          სურვილისამებრ მიმღებს შეუძლია ამანათის კომპანიის
        </Text>
        <Text style={styles.tcL}>
          4. შემოწმება {"\n"}ჯორჯიან კარგოს აქვს უფლება გაუფრთხილებლად გახსნას
          ამანთი როდესაც საქმე ეხება - უსაფრთხოებას, საბაჯო რეგულაციებსა და სხვა
          საკანონმდებლო მოთხოვნებს.
        </Text>
        <Text style={styles.tcL}>
          5. ტრანსპორტირების გადასახადი {"\n"}ჯორჯიან კარგოს ტრანსპორტირების
          გადასადს ითვლის თითო ამანათის შესაბამისად, ასევე მოცულობითი წონით.
          გამგზავნმა ან მიმღებმა უნდა დაფაროს ტრანპორტირებასთან დაკავშირებული
          ყველა ხარჯი. საბაჟო გაასახაი მოთხოვნილ იქნება ამანათის მიწოებამე.
          საბაჟო დეკლარაციის ჩაბარების გარეშე არ მოხდება ამანათის გაცემა.
        </Text>
        <Text style={styles.tcL}>
          6. ჯორჯიან კარგოს პასუხისმგებლობა{"\n"}ჯორჯიან კარგოს საჰაეროს
          გადაზიდვების უფლებები განსაზღვრულია მონრეალის კონვენციით ან ვარშავის
          კონვენციით. თუ გამგზავნი არასაკმარისად მიიჩნევს ზემოთ აღნიშნულს მას
          შეუძლია შეადინოს ღირებულების ამსახველი სპეციალური დეკლარაცია და
          ამაანთი დააზღვიოს მე8 სექციაში აღწერილი პირობების თანახმად, ან თვითონ
          დააზღვიოს ამანათი. ჯორჯიან კარგოს პასუხისმგებლობები მკაცრად
          ლიმიტირებულია გადაზიდვისას დაკარგვასა და დაზიანების კუთხით. ჯორჯიან
          კარგო შეეცდება ამანათების მოწოდება უზრუნველჰყოს მის მიერ განსაზღვრული
          ვადების შესაბამისად, თუმცა პირობები შესაძლოა შეიცვალოს, ამიტომ
          შესაბამისი ტარიღები ვერ იქნება წარმოდგენილი კონტრაქტის პირობებში.
          ჯორჯიან კარგო არ იღებს პასუხისმგებლობას დაგვიანებით გამოწვეულ
          ზარალზერ.
        </Text>
        <Text style={styles.tcL}>
          7. გასაჩივრება{"\n"}ნებისმიერი საჩივარი წარმოდგენილ უნდა იქნენას
          ჯორჯიან კარგოს საჩივრის ფორმის შევსების საშუალებით, 30 კალენდარული
          დღის ვადაში, წინააღმდეგ შემთხვევაში სარჩელი არ განიხილება. Ერთი
          გადაზიდვის პირობებში მომხმარებელს შეუძლია მხოლოდ ერთი საჩივრის აღძვრა.
        </Text>
        <Text style={styles.tcL}>
          8. გადაზიდვის დაზღვევა{"\n"}ჯორჯიან კარგომ შესაძლოა დააზღვიოს ამანთი
          ზარალის ანაზღაურებით დაკარგვისა და დაზიანების შემთხვევაში. დაზღვევის
          შემთხვევაში გამგზავნმა წერილობითად უნდა შეატყობინოს კომპანიას და
          გადაიხადოს დაზღვევის თანხა. დაზღვევა არ ფარავს დასგვიანებით გამოწვეულ
          ნებისმიერი ტიპის ზარალს. თუ გამნგზავნს სურს დიდი თანხით შეფასებული
          დაზღვევა, საჭიროა რომ დაზღვევის ტექსტი შედგეს კომპანიასთან შეთახმებით
          და შედგეს შესაბამისი წესები და პირობები გამგზავნსა და
        </Text>
        <Text style={styles.tcL}>
          9. გარემოებები რომლებიც ჯორჯიან კარგოს კონტროლს მიღმაა{"\n"}ჯორჯიან
          კარგო არ არის პასუხისმგებელი ნებიოოსმიერი ტიპის ზარალსა და ზიანზე,
          რომელიც გამოწვეულია იმ ფაქტორებით, რაც ჯორჯიან კარგოს კონტროლს მიღმაა.
          ეს მოიცავს (მაგრამ არ შემოიფარგლება)ელექტრო ან მაგნიტურ დაზიანებას,
          ინფორმაციას ან ჩანაწერს. ასევე ,,ფორს მაჟორული” სიტუაცია, რაც
          შესაძლებელი განსაზღვროს, როგორც მიწისძვრა, ციკლონი, შტორმი, ნისლი,
          წყალდიდობა, ომი, ავიაკატასტროფა, ემბარკო, აჯანყება, სამოქალაქო
          არეულობა, ან ინდუსტრილუ მდგონარეობა.
        </Text>
        <Text style={styles.tcL}>
          10. გამგზავნის გარანტიები და ანაზღაურება {"\n"}ზარალის ანაზღაურება
          შედგება იმ შემთხვევაში თუკი: გამგზავნის მიერ წარმოდგენილი ყველა
          ინფორმაცია სრულყოფილად და მართებულად არის წარმოდგენილი. გადაზიდვა არ
          შეიცავდა მეორე პუნქტში მოყვანილ აკრძალულ ნივთებს. გადაზიდვა წარმოებდა
          უსაფრთხო გარემოში, სანდო პირების მიერ, და დაცული იყო არაავტორიზებული
          პირების ჩარევისაგან თავისუფალი, ტვირთის მომზადების, შენახვისა და
          ჯორჯიან კარგომდე ტრანსპორტირებამდე. გამგზავნმა ჯორჯიან კარგოს
          წარუდგინა ყველა საჭირო ინფორმაცია, მათ შორის პირადი მონაცები,
          როგორიცაა მიმღების მონაცემები იმეილი და ტელეფონის ნომერი, რაც შესაძლოა
          საჭირო გახდეს საბაჟო პროცედურების, ტრანსპორტირებისა და ადგლზე
          მიწოდებისათვის. ზარალის ანაზაურება არ ხდება იმ შემთხვევაში თუკი:{" "}
          {"\n"}1. ამანათს არ უფიქსირდება გარეგანი დაზიანება. {"\n"}2. თუკი
          ამანათი მიმღებმა მიიღო და ადგილზე არ დააფიქსირა ნივთის
          დაზაიანება-დაკარგვა. {"\n"}3. შეფუთვა არ შეესაბამება გადაზიდვის
          სტანდარტს. {"\n"}4.თუკი არ დაფიქსირდა მანათის გატანისას ან მისამართზე
          ჩაბარებისას (სერვისის მიხედვით). Დამატებითი ინფორმაციისათვის ეწვიეთ
          ჯორჯიან კარგოს ვებსაიტს: www.georgiancargo.co.uk ან მოითხოვეთ მეტი
          ინფორმაცია ჯორჯიან კარგოს კლიენტთან მომსახურების წარმომადგენელისაგან
        </Text>
        <Text style={styles.tcP}>საზღვაო გადაზიდვის პირობები</Text>
        <Text style={styles.tcL}>
          1. კონტეინერში იგულისხმება ნებისმიერი კონტეინერი (ღია კონტეინერის
          ჩათვლით), პლატფორმის, მისაბმელის, ტრანსპორტირებადი ავზის, პალეტის ან
          სხვა მსგავსი ნივთების, რომლებიც გამოიყენება საქონლისა და ნებისმიერი
          აღჭურვილობის ერთად გადასაზიდად .
        </Text>
        <Text style={styles.tcL}>
          2. გადამზიდის ტარიფი მოიცავს ნებისმიერ დამატებით გადასახადს , რაშიც
          იგულისხმება კონტეინერის შენახვის ხარჯი, როდესაც მისი გადაზიდვა არ
          ხდება დათქმულ დროს .
        </Text>
        <Text style={styles.tcL}>
          3. შემკვეთის პასუხისმგებლობა: შემკვეთი იღებს ვალდებულებას შეასრულოს
          გადაზიდვა დატვირთვის პორტიდან მიმღებ/დანიშნულების პორტამდე. შემკვეთის
          პასუხისმგებლობა საქონლის დაკარგვის ან დაზიანებისათვის, რომელიც
          წარმოიშვება ტვირთის გადამზიდის მიერ პორტზე ტვირთის მიღების დროსა და
          გადამზიდვის მიერ საქონლის გადატანის დროს, უნდა შესრულდეს დადგენილი
          ჰააგის წესების 1-8 მუხლების შესაბამისად, თუ ამ პირობებში სხვა რამ არ
          არის გათვალისწინებული. ჰააგის წესების ეს მუხლები გამოიყენება
        </Text>
        <Text style={styles.tcL}>
          4. გადამზიდავს არანაირი პასუხისმგებლობა არ ეკისრება საქონლის
          ნებისმიერი დაკარგვის ან დაზიანებისათვის, თუ ასეთი დანაკარგი ან ზიანი
          წარმოიქმნება ტვირთის გადამზიდავის მიერ საქონლის მეურვეობის მიღებამდე
          ან მას შემდეგ, რაც გადამზიდავი ტვირთს გადასცემს მისაწოდებლად.
        </Text>
        <Text style={styles.tcL}>
          5. კომპენსაციისა და პასუხისმგებლობის დებულებები
        </Text>
        <Text style={styles.tcL}>
          5.1.გადამზიდს შეუძლია შეიზღუდოს პასუხისმგებლობა ,ამ მუხლით
          გათვალისწინებული წესით ,ტვირთის დაზიანების ან დაკარგვის შემთხვევაში
          კომპენსაციაზე (კომპენსაცია მოიცავს ტვირთის ღირებულებას დამატებული
          გადაზიდვის ღირებულება და ასევე დაზღვევაც, თუ გადახდილია დაღვევის
          საფასური) . საქონლის ღირებულება განისაზღვრება კომერციული ინვოისის,
          საბაჟო დეკლარაციის, საბაზრო ფასის (მათი ჩაბარების დროის და ადგილის
          მიხ. ), წარმოების ფასის ან იმავე სახის საქონლის გონივრული ღირებულების
          მითითებით.
        </Text>
        <Text style={styles.tcL}>
          5.2.გადამზიდის პასუხისმგებლობა არც ერთ შემთხვევაში არ უნდა
          აღემატებოდეს 2 SDR- ს ,დაკარგული ან დაზიანებული საქონლის 1 კილოზე .
        </Text>
        <Text style={styles.tcL}>
          6. გადამზიდი არ იღებს ვალდებულებას, რომ საქონელი ან მასთან
          დაკავშირებული ნებისმიერი დოკუმენტი უნდა ჩამოვიდეს ან ხელმისაწვდომი
          იყოს ნებისმიერ ეტაპზე, ნებისმიერ ადგილზე, კონკრეტულ დროს.თუკი
          გადამზიდს კანონიერად დაეკისრება პასუხისმგებლობა რაიმე შეფერხებით
          გამოწვეული პირდაპირი ან არაპირდაპირი ზარალის ან ზიანისათვის, ამგვარი
          პასუხისმგებლობა არავითარ შემთხვევაში არ უნდა აღემატებოდეს გადახდილ
          თანხას.
        </Text>
        <Text style={styles.tcL}>
          7. ნებისმიერ სხვა შემთხვევაში გადამზიდი იხსნის დანაკარგის ანაზღაურების
          პასუხისმგებლობას .
        </Text>
        <Text style={styles.tcL}>
          8. ტვირთის გადამზიდის მიერ საქონლის მიღების შემდეგ, მომხმარებელს
          უფლება არა აქვს ხელი შეუშალოს, დააგვიანოს, შეაჩეროს ან სხვაგვარად
          ჩაერიოს გადამზიდის მიერ გადაზიდვის შესრულებაში. ასეთ შემთხვევაში
          გამგნზავნს მოუწევს გადამზიდს აუნაზღაუროს ყველანაირი ზიანის საფასური,
          რაც წარმოიქმნება ასეთ შემთხვევაში მისი ჩარევის შედეგად.
        </Text>
        <Text style={styles.tcL}>
          9. გადამზიდს ეხსნება პასუხისმგებლობა აღწეროს ტვირთი, აწონოს,დაადგინოს
          მისი ღირებულება.
        </Text>
        <Text style={styles.tcL}>
          10. გამგზავნი იძლევა გარანტიას, რომ საქონელი არის კანონიერი საქონელი
          და არ შეიცავს კონტრაბანდას, წამლებს ან სხვა უკანონო ნივთიერებებს , რაც
          გამოიწვევს გადამზიდის დანაკარგს ან დაზიანებას.
        </Text>
        <Text style={styles.tcL}>
          11. სავაჭრო ობიექტი უნდა აკმაყოფილებდეს საბაჟო, საპორტო და სხვა
          ორგანოების ყველა რეგულაციას ან მოთხოვნებს და ეკისრება გადასახადი
          საქონლის ნებისმიერი უკანონო, არასწორი ან არასაკმარისი დეკლარაციის,
          მარკირების, ნუმერაციის ან მისამართის გამო.
        </Text>
        <Text style={styles.tcL}>
          12. მომხმარებელი ვალდებულია, რომ შეფუთოს ტვირთი ისე, რომ არ
          დააზიანოს/დაანაგვიანოს კონტეინერი , წინააღმდეგ შემთხვევაში დაეკისრება
          ზარალის ანაზღაურებაგამგზავნს.
        </Text>
        <Text style={styles.tcL}>
          13. სავაჭრო ობიექტებმა უნდა იცოდნენ მათთვის გამოყოფილი კონტეინერების
          ზომები და ტევადობა.
        </Text>
      </ScrollView>

      <TouchableOpacity
        disabled={!accepted}
        onPress={() => {
          // console.log(setTnC);
          setTnC(true);
          setTncErrMsg(false);
          setAcc(true);
          navigation.goBack();
        }}
        style={accepted ? styles.button : styles.buttonDisabled}
      >
        <Text style={styles.buttonLabel}>Accept / თანხმობა</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    alignSelf: "center",
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 17,
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: height * 0.7,
  },

  button: {
    backgroundColor: "#136AC7",
    borderRadius: 5,
    padding: 10,
  },

  buttonDisabled: {
    backgroundColor: "#999",
    borderRadius: 5,
    padding: 10,
  },

  buttonLabel: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center",
  },
});

export default TermsCoButton;
