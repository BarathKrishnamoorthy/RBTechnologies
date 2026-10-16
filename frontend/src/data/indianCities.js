/**
 * Indian Cities, Towns, Transport Hubs & Coordinates
 * 100% Offline-reliable dictionary for autocomplete and instantaneous map geocoding.
 */

export const INDIAN_CITIES = [
  // Tamil Nadu
  { name: 'Chennai', state: 'Tamil Nadu', hubs: 'Koyambedu, Guindy, Tambaram, Airport, Central', coords: [13.0827, 80.2707] },
  { name: 'Salem', state: 'Tamil Nadu', hubs: 'New Bus Stand, Old Bus Stand, Junction, Steel Plant, Kondalampatti', coords: [11.6643, 78.1460] },
  { name: 'Coimbatore', state: 'Tamil Nadu', hubs: 'Gandhipuram, Hope College, Singanallur, Ukkadam, Peelamedu', coords: [11.0168, 76.9558] },
  { name: 'Madurai', state: 'Tamil Nadu', hubs: 'Mattuthavani, Periyar, Arapalayam, AIIMS, Teppakulam', coords: [9.9252, 78.1198] },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', hubs: 'Central Bus Stand, Chathiram, Airport, NIT, Srirangam', coords: [10.7905, 78.7047] },
  { name: 'Trichy', state: 'Tamil Nadu', hubs: 'Central Bus Stand, Chathiram, Airport, NIT', coords: [10.7905, 78.7047] },
  { name: 'Vellore', state: 'Tamil Nadu', hubs: 'New Bus Stand, CMC Hospital, Katpadi Junction, VIT', coords: [12.9165, 79.1325] },
  { name: 'Hosur', state: 'Tamil Nadu', hubs: 'Bus Stand, Sipcot, Zuzuwadi, Bagalur Road, Chandapura', coords: [12.7409, 77.8253] },
  { name: 'Erode', state: 'Tamil Nadu', hubs: 'Central Bus Stand, Railway Station, Perundurai, Bhavani', coords: [11.3410, 77.7172] },
  { name: 'Tirupur', state: 'Tamil Nadu', hubs: 'Old Bus Stand, New Bus Stand, Avinashi Road', coords: [11.1085, 77.3411] },
  { name: 'Tirunelveli', state: 'Tamil Nadu', hubs: 'New Bus Stand, Junction, Palayamkottai, Vannarpettai', coords: [8.7139, 77.7567] },
  { name: 'Thoothukudi', state: 'Tamil Nadu', hubs: 'Old Bus Stand, New Bus Stand, Port, Spic Nagar', coords: [8.7642, 78.1348] },
  { name: 'Tuticorin', state: 'Tamil Nadu', hubs: 'Old Bus Stand, New Bus Stand, Port', coords: [8.7642, 78.1348] },
  { name: 'Dindigul', state: 'Tamil Nadu', hubs: 'Bus Stand, Begambur, Railway Station, Palani Road', coords: [10.3673, 77.9803] },
  { name: 'Kanchipuram', state: 'Tamil Nadu', hubs: 'Bus Stand, Gandhi Road, Temple Gate, Enathur', coords: [12.8342, 79.7036] },
  { name: 'Villupuram', state: 'Tamil Nadu', hubs: 'New Bus Stand, Old Bus Stand, Railway Junction, Toll Gate', coords: [11.9401, 79.4861] },
  { name: 'Pondicherry', state: 'Puducherry', hubs: 'White Town, Bus Stand, Promenade, Auroville, ECR', coords: [11.9416, 79.8083] },
  { name: 'Puducherry', state: 'Puducherry', hubs: 'White Town, Bus Stand, Promenade, Auroville', coords: [11.9416, 79.8083] },
  { name: 'Thanjavur', state: 'Tamil Nadu', hubs: 'New Bus Stand, Old Bus Stand, Big Temple, Medical College', coords: [10.7870, 79.1378] },
  { name: 'Kumbakonam', state: 'Tamil Nadu', hubs: 'Bus Stand, Mahamaham Tank, Railway Station', coords: [10.9602, 79.3845] },
  { name: 'Nagercoil', state: 'Tamil Nadu', hubs: 'Vadasery Bus Stand, Anna Bus Stand, Chettikulam', coords: [8.1833, 77.4119] },
  { name: 'Kanyakumari', state: 'Tamil Nadu', hubs: 'Cape Comorin, Bus Stand, Sunset Point, Vivekananda Rock', coords: [8.0883, 77.5385] },
  { name: 'Karur', state: 'Tamil Nadu', hubs: 'Bus Stand, Gandhigramam, Railway Station, Kovai Road', coords: [10.9601, 78.0766] },
  { name: 'Namakkal', state: 'Tamil Nadu', hubs: 'Bus Stand, Anjaneyar Temple, Mohanur Road, Collectorate', coords: [11.2189, 78.1674] },
  { name: 'Dharmapuri', state: 'Tamil Nadu', hubs: 'Bus Stand, Hogenakkal Road, Collectorate', coords: [12.1211, 78.1582] },
  { name: 'Krishnagiri', state: 'Tamil Nadu', hubs: 'New Bus Stand, Old Bus Stand, Toll Gate, Bangalore Road', coords: [12.5186, 78.2137] },
  { name: 'Ambur', state: 'Tamil Nadu', hubs: 'Bus Stand, MC Road, Bypass, Odugathur Road', coords: [12.7904, 78.7166] },
  { name: 'Vaniyambadi', state: 'Tamil Nadu', hubs: 'Bus Stand, CLRI, Highway, New Town', coords: [12.6825, 78.6186] },
  { name: 'Ranipet', state: 'Tamil Nadu', hubs: 'Bus Stand, BHEL, Sipcot, Walajah Road', coords: [12.9274, 79.3330] },
  { name: 'Chengalpattu', state: 'Tamil Nadu', hubs: 'New Bus Stand, Toll Plaza, GST Road, Mahindra City', coords: [12.6819, 79.9888] },
  { name: 'Tindivanam', state: 'Tamil Nadu', hubs: 'Bus Stand, Mailam, Gingee Road, Roshanai', coords: [12.2355, 79.6499] },
  { name: 'Perambalur', state: 'Tamil Nadu', hubs: 'New Bus Stand, NH-45 Bypass, Roever', coords: [11.2342, 78.8820] },
  { name: 'Cuddalore', state: 'Tamil Nadu', hubs: 'Bus Stand, Silver Beach, OT, Gundu Salai', coords: [11.7480, 79.7714] },
  { name: 'Nagapattinam', state: 'Tamil Nadu', hubs: 'New Bus Stand, Velankanni Road, Port', coords: [10.7672, 79.8449] },
  { name: 'Velankanni', state: 'Tamil Nadu', hubs: 'Church Gate, Bus Stand, Beach Road', coords: [10.6806, 79.8427] },
  { name: 'Theni', state: 'Tamil Nadu', hubs: 'New Bus Stand, Old Bus Stand, Periyakulam Road', coords: [10.0104, 77.4768] },
  { name: 'Virudhunagar', state: 'Tamil Nadu', hubs: 'Bus Stand, Railway Junction, Sivakasi Road', coords: [9.5680, 77.9624] },
  { name: 'Sivakasi', state: 'Tamil Nadu', hubs: 'Bus Stand, Sattur Road, Thiruthangal', coords: [9.4532, 77.7933] },
  { name: 'Ooty', state: 'Tamil Nadu', hubs: 'Main Bus Stand, Charing Cross, Botanical Garden', coords: [11.4102, 76.6950] },
  { name: 'Kodaikanal', state: 'Tamil Nadu', hubs: 'Bus Stand, Lake Road, Coaker Walk', coords: [10.2381, 77.4892] },
  { name: 'Palani', state: 'Tamil Nadu', hubs: 'Bus Stand, Adivaram, Giri Veedhi', coords: [10.4503, 77.5196] },
  { name: 'Pollachi', state: 'Tamil Nadu', hubs: 'Bus Stand, Udumalai Road, Mahalingapuram', coords: [10.6580, 77.0099] },
  { name: 'Ramanathapuram', state: 'Tamil Nadu', hubs: 'Bus Stand, Rameswaram Road, Aranmanai', coords: [9.3639, 78.8395] },
  { name: 'Rameswaram', state: 'Tamil Nadu', hubs: 'Temple West Tower, Bus Stand, Agnitheertham', coords: [9.2876, 79.3129] },

  // Karnataka
  { name: 'Bengaluru', state: 'Karnataka', hubs: 'Silk Board, Majestic, Electronic City, Whitefield, Hebbal, Kengeri', coords: [12.9716, 77.5946] },
  { name: 'Bangalore', state: 'Karnataka', hubs: 'Silk Board, Majestic, Electronic City, Whitefield, Hebbal, Kengeri', coords: [12.9716, 77.5946] },
  { name: 'Mysuru', state: 'Karnataka', hubs: 'Suburban Bus Stand, Palace, KSRTC Central, Ring Road', coords: [12.2958, 76.6394] },
  { name: 'Mysore', state: 'Karnataka', hubs: 'Suburban Bus Stand, Palace, KSRTC Central, Ring Road', coords: [12.2958, 76.6394] },
  { name: 'Mangaluru', state: 'Karnataka', hubs: 'KSRTC Bejai, Pumpwell, State Bank, Surathkal', coords: [12.9141, 74.8560] },
  { name: 'Mangalore', state: 'Karnataka', hubs: 'KSRTC Bejai, Pumpwell, State Bank, Surathkal', coords: [12.9141, 74.8560] },
  { name: 'Hubballi', state: 'Karnataka', hubs: 'Old Bus Stand, New Bus Stand, Chennamma Circle, Gokul Road', coords: [15.3647, 75.1240] },
  { name: 'Hubli', state: 'Karnataka', hubs: 'Old Bus Stand, New Bus Stand, Chennamma Circle', coords: [15.3647, 75.1240] },
  { name: 'Dharwad', state: 'Karnataka', hubs: 'CBT, Court Circle, Jubilee Circle', coords: [15.4589, 75.0078] },
  { name: 'Belagavi', state: 'Karnataka', hubs: 'CBT, Central Bus Stand, RPD Corner, Fort', coords: [15.8497, 74.4977] },
  { name: 'Tumakuru', state: 'Karnataka', hubs: 'KSRTC Bus Stand, Kyatsandra, Toll Gate, SIT', coords: [13.3392, 77.1017] },
  { name: 'Tumkur', state: 'Karnataka', hubs: 'KSRTC Bus Stand, Kyatsandra, Toll Gate', coords: [13.3392, 77.1017] },
  { name: 'Shivamogga', state: 'Karnataka', hubs: 'KSRTC Bus Stand, Gopi Circle, Gandhi Park', coords: [13.9299, 75.5681] },
  { name: 'Shimoga', state: 'Karnataka', hubs: 'KSRTC Bus Stand, Gopi Circle', coords: [13.9299, 75.5681] },
  { name: 'Udupi', state: 'Karnataka', hubs: 'City Bus Stand, Service Bus Stand, Manipal Tiger Circle', coords: [13.3409, 74.7421] },
  { name: 'Manipal', state: 'Karnataka', hubs: 'Tiger Circle, MIT Gate, KMC', coords: [13.3525, 74.7865] },
  { name: 'Hassan', state: 'Karnataka', hubs: 'New Bus Stand, B.M. Road, Ring Road', coords: [13.0072, 76.0962] },
  { name: 'Chikkamagaluru', state: 'Karnataka', hubs: 'KSRTC Bus Stand, IG Road, Azad Park', coords: [13.3161, 75.7720] },
  { name: 'Chitradurga', state: 'Karnataka', hubs: 'KSRTC Bus Stand, Fort View, Bypass', coords: [14.2251, 76.3980] },
  { name: 'Davanagere', state: 'Karnataka', hubs: 'KSRTC Bus Stand, PB Road, Bapuji Institute', coords: [14.4644, 75.9218] },
  { name: 'Ballari', state: 'Karnataka', hubs: 'New Bus Stand, Royal Circle, Infantry Road', coords: [15.1394, 76.9214] },
  { name: 'Kalaburagi', state: 'Karnataka', hubs: 'Central Bus Stand, Super Market, Sedam Road', coords: [17.3297, 76.8343] },
  { name: 'Gulbarga', state: 'Karnataka', hubs: 'Central Bus Stand, Super Market', coords: [17.3297, 76.8343] },
  { name: 'Mandya', state: 'Karnataka', hubs: 'KSRTC Bus Stand, Sugar Factory, Highway', coords: [12.5242, 76.8958] },
  { name: 'Bidar', state: 'Karnataka', hubs: 'Central Bus Stand, Fort, Gurudwara', coords: [17.9104, 77.5199] },
  { name: 'Kolar', state: 'Karnataka', hubs: 'KSRTC Bus Stand, Doomlight Circle, Tamaka', coords: [13.1367, 78.1292] },

  // Maharashtra
  { name: 'Mumbai', state: 'Maharashtra', hubs: 'Dadar, Borivali, Vashi, Thane, BKC, Andheri, Chembur', coords: [19.0760, 72.8777] },
  { name: 'Pune', state: 'Maharashtra', hubs: 'Wakad, Shivajinagar, Hinjewadi, Swargate, Viman Nagar, Hadapsar', coords: [18.5204, 73.8567] },
  { name: 'Navi Mumbai', state: 'Maharashtra', hubs: 'Vashi Plaza, Nerul LP, Kharghar, Panvel, Belapur', coords: [19.0330, 73.0297] },
  { name: 'Thane', state: 'Maharashtra', hubs: 'Teen Hath Naka, Majiwada, Station, Ghodbunder Road', coords: [19.2183, 72.9781] },
  { name: 'Nashik', state: 'Maharashtra', hubs: 'CBS, Dwarka Circle, Mumbai Naka, College Road', coords: [19.9975, 73.7898] },
  { name: 'Nagpur', state: 'Maharashtra', hubs: 'Mor Bhavan, Sitabuldi, Wardha Road, Medical Square', coords: [21.1458, 79.0882] },
  { name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', hubs: 'CIDCO, Central Bus Stand, Railway Station, Kranti Chowk', coords: [19.8762, 75.3433] },
  { name: 'Aurangabad', state: 'Maharashtra', hubs: 'CIDCO, Central Bus Stand, Railway Station', coords: [19.8762, 75.3433] },
  { name: 'Solapur', state: 'Maharashtra', hubs: 'Central Bus Stand, Saat Rasta, Old Pune Naka', coords: [17.6599, 75.9064] },
  { name: 'Kolhapur', state: 'Maharashtra', hubs: 'CBS, Kawala Naka, Shiroli, Mahalaxmi Temple', coords: [16.7050, 74.2433] },
  { name: 'Amravati', state: 'Maharashtra', hubs: 'Rajkamal Square, Badnera Road, Irwin Chowk', coords: [20.9374, 77.7796] },
  { name: 'Satara', state: 'Maharashtra', hubs: 'Central Bus Stand, Powai Naka, Bombay Restaurant Chowk', coords: [17.6805, 73.9997] },
  { name: 'Lonavala', state: 'Maharashtra', hubs: 'Kumar Resort, Toll Plaza, Express Highway, Market', coords: [18.7546, 73.4062] },
  { name: 'Khandala', state: 'Maharashtra', hubs: 'Ghat, Express Toll, View Point', coords: [18.7610, 73.3768] },
  { name: 'Mahabaleshwar', state: 'Maharashtra', hubs: 'ST Bus Stand, Venna Lake, Panchgani', coords: [17.9237, 73.6586] },
  { name: 'Panchgani', state: 'Maharashtra', hubs: 'Table Land, Bus Stand, Ruighar', coords: [17.9254, 73.8008] },
  { name: 'Shirdi', state: 'Maharashtra', hubs: 'Sai Nagar, Temple Gate, Nagar Manmad Road', coords: [19.7645, 74.4762] },
  { name: 'Nanded', state: 'Maharashtra', hubs: 'Gurudwara Gate, Central Bus Stand, Workshop Corner', coords: [19.1383, 77.3210] },

  // Telangana & Andhra Pradesh
  { name: 'Hyderabad', state: 'Telangana', hubs: 'Gachibowli, Ameerpet, Hitec City, Secunderabad, LB Nagar, Miyapur, Kukatpally', coords: [17.3850, 78.4867] },
  { name: 'Secunderabad', state: 'Telangana', hubs: 'Jubilee Bus Station, Railway Station, Paradise, Alwal', coords: [17.4399, 78.4983] },
  { name: 'Warangal', state: 'Telangana', hubs: 'Hanamkonda Bus Station, Kazipet, Subedari', coords: [17.9689, 79.5941] },
  { name: 'Nizamabad', state: 'Telangana', hubs: 'RTC Bus Stand, Railway Station, Armoor Road', coords: [18.6725, 78.0941] },
  { name: 'Karimnagar', state: 'Telangana', hubs: 'RTC Bus Station, Kaman Chowk, Collectorate', coords: [18.4386, 79.1288] },
  { name: 'Khammam', state: 'Telangana', hubs: 'Old Bus Stand, New Bus Stand, Wyra Road', coords: [17.2473, 80.1514] },
  { name: 'Mahbubnagar', state: 'Telangana', hubs: 'RTC Bus Stand, Clock Tower, Jadcherla Junction', coords: [16.7488, 77.9840] },
  { name: 'Vijayawada', state: 'Andhra Pradesh', hubs: 'Pandit Nehru Bus Station, Benz Circle, Ramavarappadu, Poranki', coords: [16.5062, 80.6480] },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', hubs: 'RTC Complex, Maddilapalem, Gajuwaka, NAD Kotha Road, Kurmannapalem', coords: [17.6868, 83.2185] },
  { name: 'Vizag', state: 'Andhra Pradesh', hubs: 'RTC Complex, Maddilapalem, Gajuwaka, NAD Junction', coords: [17.6868, 83.2185] },
  { name: 'Tirupati', state: 'Andhra Pradesh', hubs: 'Central Bus Station, Alipiri, Railway Station, Renigunta', coords: [13.6288, 79.4192] },
  { name: 'Guntur', state: 'Andhra Pradesh', hubs: 'NTR Bus Station, Market, Auto Nagar, Lodge Centre', coords: [16.3067, 80.4365] },
  { name: 'Nellore', state: 'Andhra Pradesh', hubs: 'RTC Bus Stand, Current Office Center, Mini Bypass', coords: [14.4426, 79.9865] },
  { name: 'Kurnool', state: 'Andhra Pradesh', hubs: 'RTC Bus Stand, Bellary Chowk, C-Camp, Raj Vihar', coords: [15.8281, 78.0373] },
  { name: 'Anantapur', state: 'Andhra Pradesh', hubs: 'Clock Tower, RTC Bus Stand, Sapthagiri Circle', coords: [14.6819, 77.6006] },
  { name: 'Rajahmundry', state: 'Andhra Pradesh', hubs: 'Kotipalli Bus Stand, Morampudi, Lalacheruvu', coords: [17.0005, 81.8040] },
  { name: 'Kakinada', state: 'Andhra Pradesh', hubs: 'RTC Complex, Bhanugudi Junction, Port', coords: [16.9891, 82.2475] },
  { name: 'Kadapa', state: 'Andhra Pradesh', hubs: 'Old Bus Stand, New Bus Stand, Seven Roads', coords: [14.4673, 78.8242] },
  { name: 'Ongole', state: 'Andhra Pradesh', hubs: 'RTC Bus Stand, Church Centre, Kurnool Road', coords: [15.5057, 80.0499] },
  { name: 'Eluru', state: 'Andhra Pradesh', hubs: 'Old Bus Stand, Fire Station, Sanivarapupeta', coords: [16.7107, 81.0952] },

  // Kerala
  { name: 'Kochi', state: 'Kerala', hubs: 'Vyttila Mobility Hub, Edappally, Aluva, Kakkanad, Palarivattom', coords: [9.9312, 76.2673] },
  { name: 'Cochin', state: 'Kerala', hubs: 'Vyttila Mobility Hub, Edappally, Aluva, Kakkanad', coords: [9.9312, 76.2673] },
  { name: 'Ernakulam', state: 'Kerala', hubs: 'South Railway Station, KSRTC Central, North Station', coords: [9.9816, 76.2999] },
  { name: 'Thiruvananthapuram', state: 'Kerala', hubs: 'Thampanoor KSRTC, Kazhakkoottam (Technopark), East Fort, Palayam', coords: [8.5241, 76.9366] },
  { name: 'Trivandrum', state: 'Kerala', hubs: 'Thampanoor KSRTC, Kazhakkoottam (Technopark), East Fort', coords: [8.5241, 76.9366] },
  { name: 'Kozhikode', state: 'Kerala', hubs: 'Mofussil Bus Stand, Palayam, Calicut Bypass, Thondayad', coords: [11.2588, 75.7804] },
  { name: 'Calicut', state: 'Kerala', hubs: 'Mofussil Bus Stand, Palayam, Calicut Bypass', coords: [11.2588, 75.7804] },
  { name: 'Thrissur', state: 'Kerala', hubs: 'KSRTC Sakthan, Round, Mannuthy, Kuriachira', coords: [10.5276, 76.2144] },
  { name: 'Palakkad', state: 'Kerala', hubs: 'Stadium Bus Stand, KSRTC, Chandranagar, Robinson Road', coords: [10.7867, 76.6548] },
  { name: 'Aluva', state: 'Kerala', hubs: 'Metro Station, KSRTC Bus Stand, Bypass Junction', coords: [10.1076, 76.3516] },
  { name: 'Kollam', state: 'Kerala', hubs: 'KSRTC Bus Stand, Chinnakada, Kadappakada', coords: [8.8932, 76.6141] },
  { name: 'Kannur', state: 'Kerala', hubs: 'Caltex Junction, Thavakkara Bus Stand, South Bazaar', coords: [11.8745, 75.3704] },
  { name: 'Alappuzha', state: 'Kerala', hubs: 'KSRTC Bus Stand, Boat Jetty, Kalappura', coords: [9.4981, 76.3388] },
  { name: 'Alleppey', state: 'Kerala', hubs: 'KSRTC Bus Stand, Boat Jetty', coords: [9.4981, 76.3388] },
  { name: 'Kottayam', state: 'Kerala', hubs: 'KSRTC Bus Stand, Nagampadam, Baker Junction', coords: [9.5916, 76.5222] },
  { name: 'Malappuram', state: 'Kerala', hubs: 'KSRTC Bus Stand, Up Hill, Down Hill', coords: [11.0732, 76.0740] },
  { name: 'Kasaragod', state: 'Kerala', hubs: 'Old Bus Stand, New Bus Stand, Karanakkad', coords: [12.5102, 74.9852] },

  // Delhi NCR & North
  { name: 'Delhi', state: 'NCR', hubs: 'Connaught Place, Kashmere Gate ISBT, Anand Vihar ISBT, Sarai Kale Khan, Dhaula Kuan', coords: [28.6139, 77.2090] },
  { name: 'New Delhi', state: 'NCR', hubs: 'Connaught Place, New Delhi Railway Station, Airport T3', coords: [28.6139, 77.2090] },
  { name: 'Noida', state: 'Uttar Pradesh', hubs: 'Sector 18, Botanical Garden, Pari Chowk (Greater Noida), Sector 62', coords: [28.5355, 77.3910] },
  { name: 'Greater Noida', state: 'Uttar Pradesh', hubs: 'Pari Chowk, Knowledge Park, Alpha 1', coords: [28.4744, 77.5040] },
  { name: 'Gurugram', state: 'Haryana', hubs: 'IFFCO Chowk, Rajiv Chowk, Cyber City, Huda City Centre, MG Road', coords: [28.4595, 77.0266] },
  { name: 'Gurgaon', state: 'Haryana', hubs: 'IFFCO Chowk, Rajiv Chowk, Cyber City, Huda City Centre', coords: [28.4595, 77.0266] },
  { name: 'Faridabad', state: 'Haryana', hubs: 'Bata Chowk, Badarpur Border, Old Faridabad', coords: [28.4089, 77.3178] },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', hubs: 'Mohan Nagar, Anand Vihar Border, Vaishali, Raj Nagar Extension', coords: [28.6692, 77.4538] },
  { name: 'Jaipur', state: 'Rajasthan', hubs: 'Sindhi Camp Bus Stand, 200 Feet Bypass, Narayan Singh Circle, Malviya Nagar', coords: [26.9124, 75.7873] },
  { name: 'Chandigarh', state: 'Punjab / Haryana', hubs: 'ISBT Sector 43, ISBT Sector 17, Tribune Chowk, Housing Board', coords: [30.7333, 76.7794] },
  { name: 'Mohali', state: 'Punjab', hubs: 'Phase 7, Phase 3B2, Kharar Toll Plaza', coords: [30.7046, 76.7179] },
  { name: 'Panchkula', state: 'Haryana', hubs: 'Sector 5, Amartex, MDC', coords: [30.6942, 76.8606] },
  { name: 'Ambala', state: 'Haryana', hubs: 'Ambala Cantt Bus Stand, Twin City, Railway Station', coords: [30.3782, 76.7767] },
  { name: 'Panipat', state: 'Haryana', hubs: 'Toll Plaza, Bus Stand, Sector 12', coords: [29.3909, 76.9635] },
  { name: 'Karnal', state: 'Haryana', hubs: 'Nirmal Kutiya, ITI Chowk, Bus Stand', coords: [29.6857, 76.9905] },
  { name: 'Kurukshetra', state: 'Haryana', hubs: 'Pipli Bus Stand, University Gate', coords: [29.9695, 76.8783] },
  { name: 'Agra', state: 'Uttar Pradesh', hubs: 'Idgah Bus Stand, Bhagwan Talkies, ISBT Transport Nagar, Water Works', coords: [27.1767, 78.0081] },
  { name: 'Mathura', state: 'Uttar Pradesh', hubs: 'Janmabhoomi, New Bus Stand, Highway Plaza', coords: [27.4924, 77.6737] },
  { name: 'Vrindavan', state: 'Uttar Pradesh', hubs: 'Prem Mandir, Chhatikara Road, Bus Stand', coords: [27.5806, 77.7006] },
  { name: 'Lucknow', state: 'Uttar Pradesh', hubs: 'Alambagh ISBT, Charbagh, Polytechnic Crossing, Kamta Chauraha', coords: [26.8467, 80.9462] },
  { name: 'Kanpur', state: 'Uttar Pradesh', hubs: 'Jhakarkati Bus Station, Rawatpur, Rama Devi, Chakeri', coords: [26.4499, 80.3319] },
  { name: 'Varanasi', state: 'Uttar Pradesh', hubs: 'Cantt Bus Station, Lanka (BHU), Godowlia, Babatpur Airport', coords: [25.3176, 82.9739] },
  { name: 'Prayagraj', state: 'Uttar Pradesh', hubs: 'Civil Lines Bus Station, Zero Road, Sangam', coords: [25.4358, 81.8463] },
  { name: 'Allahabad', state: 'Uttar Pradesh', hubs: 'Civil Lines Bus Station, Zero Road', coords: [25.4358, 81.8463] },
  { name: 'Dehradun', state: 'Uttarakhand', hubs: 'ISBT Dehradun, Clock Tower, Rispana Bridge', coords: [30.3165, 78.0322] },
  { name: 'Haridwar', state: 'Uttarakhand', hubs: 'Har Ki Pauri, Bus Stand, Railway Station, Chandichowk', coords: [29.9457, 78.1642] },
  { name: 'Rishikesh', state: 'Uttarakhand', hubs: 'Natraj Chowk, Tapovan, Bus Stand, Ram Jhula', coords: [30.0869, 78.2676] },
  { name: 'Shimla', state: 'Himachal Pradesh', hubs: 'ISBT Tutikandi, Victory Tunnel, Sanjauli', coords: [31.1048, 77.1734] },
  { name: 'Manali', state: 'Himachal Pradesh', hubs: 'Private Bus Stand, Mall Road, Aleo', coords: [32.2432, 77.1892] },
  { name: 'Amritsar', state: 'Punjab', hubs: 'Golden Temple, Bus Stand, Alpha One, Airport', coords: [31.6340, 74.8723] },
  { name: 'Ludhiana', state: 'Punjab', hubs: 'Bus Stand, Samrala Chowk, Ferozepur Road', coords: [30.9010, 75.8573] },
  { name: 'Jalandhar', state: 'Punjab', hubs: 'Rama Mandi, BMC Chowk, Bus Stand', coords: [31.3260, 75.5762] },

  // West & Central
  { name: 'Ahmedabad', state: 'Gujarat', hubs: 'Geeta Mandir, ISKCON Cross Road, Paldi, CTM Cross Road, SG Highway', coords: [23.0225, 72.5714] },
  { name: 'Surat', state: 'Gujarat', hubs: 'Central Bus Station, Kamrej Char Rasta, Ring Road, Varachha', coords: [21.1702, 72.8311] },
  { name: 'Vadodara', state: 'Gujarat', hubs: 'Central Bus Station, Amit Nagar, Pandya Bridge, Waghodia Chowk', coords: [22.3072, 73.1812] },
  { name: 'Baroda', state: 'Gujarat', hubs: 'Central Bus Station, Amit Nagar', coords: [22.3072, 73.1812] },
  { name: 'Rajkot', state: 'Gujarat', hubs: 'Greenland Chokdi, Madhapar, Trikon Baug, Gondal Chowk', coords: [22.3039, 70.8022] },
  { name: 'Bhavnagar', state: 'Gujarat', hubs: 'Central Bus Stand, Nari Chokdi', coords: [21.7645, 72.1519] },
  { name: 'Jamnagar', state: 'Gujarat', hubs: 'Victoria Bridge, Gulabnagar, Bus Stand', coords: [22.4707, 70.0577] },
  { name: 'Anand', state: 'Gujarat', hubs: 'Ganesh Chokdi, Express Highway, Bus Stand', coords: [22.5645, 72.9289] },
  { name: 'Nadiad', state: 'Gujarat', hubs: 'Express Toll, Santram Mandir, Bus Stand', coords: [22.6916, 72.8634] },
  { name: 'Bharuch', state: 'Gujarat', hubs: 'Narmada Bridge, Zadeshwar Chowkdi', coords: [21.7051, 72.9959] },
  { name: 'Ankleshwar', state: 'Gujarat', hubs: 'GIDC, Valia Chowkdi, Bus Stand', coords: [21.6264, 73.0039] },
  { name: 'Vapi', state: 'Gujarat', hubs: 'Gunjan Char Rasta, GIDC, Bus Stand', coords: [20.3893, 72.9106] },
  { name: 'Udaipur', state: 'Rajasthan', hubs: 'Udiapole Bus Stand, Sukher, Reti Stand, Fatehpura', coords: [24.5854, 73.7125] },
  { name: 'Jodhpur', state: 'Rajasthan', hubs: 'Paota Bus Stand, Jalori Gate, Akhaliya Circle', coords: [26.2389, 73.0243] },
  { name: 'Kota', state: 'Rajasthan', hubs: 'Nayapura Bus Stand, Aerodrome Circle, Talwandi', coords: [25.2138, 75.8648] },
  { name: 'Ajmer', state: 'Rajasthan', hubs: 'Dargah Sharif, Bus Stand, Makhupura Bypass', coords: [26.4499, 74.6399] },
  { name: 'Pushkar', state: 'Rajasthan', hubs: 'Marwar Bus Stand, Brahma Temple', coords: [26.4897, 74.5511] },
  { name: 'Bikaner', state: 'Rajasthan', hubs: 'KEM Road, Rani Bazaar, Junagarh', coords: [28.0229, 73.3119] },
  { name: 'Goa', state: 'Goa', hubs: 'Panaji KTC, Margao KTC, Mapusa, Calangute, Dabolim Airport', coords: [15.2993, 74.1240] },
  { name: 'Panaji', state: 'Goa', hubs: 'KTC Bus Stand, Patto Plaza, Miramar', coords: [15.4909, 73.8278] },
  { name: 'Margao', state: 'Goa', hubs: 'KTC Bus Stand, Railway Station, Colva Road', coords: [15.2832, 73.9862] },
  { name: 'Mapusa', state: 'Goa', hubs: 'KTC Bus Stand, Market, Bastora', coords: [15.5937, 73.8144] },
  { name: 'Vasco da Gama', state: 'Goa', hubs: 'KTC Bus Stand, Dabolim, Port', coords: [15.3991, 73.8157] },
  { name: 'Bhopal', state: 'Madhya Pradesh', hubs: 'ISBT, Nadra Bus Stand, Lalghati, Habibganj', coords: [23.2599, 77.4126] },
  { name: 'Indore', state: 'Madhya Pradesh', hubs: 'Sarwate Bus Stand, Vijay Nagar, AICTSL, Bhanwarkuan', coords: [22.7196, 75.8577] },
  { name: 'Gwalior', state: 'Madhya Pradesh', hubs: 'Morar, Kampoo, Railway Station, Padav', coords: [26.2183, 78.1828] },
  { name: 'Jabalpur', state: 'Madhya Pradesh', hubs: 'ISBT Deendayal Chowk, Malviya Chowk, Bhedaghat', coords: [23.1815, 79.9864] },
  { name: 'Ujjain', state: 'Madhya Pradesh', hubs: 'Mahakal Mandir, Nanakheda Bus Stand, Dewas Gate', coords: [23.1765, 75.7885] },

  // East & Other Major
  { name: 'Kolkata', state: 'West Bengal', hubs: 'Esplanade, Howrah Station, Ultadanga, Airport, Salt Lake', coords: [22.5726, 88.3639] },
  { name: 'Howrah', state: 'West Bengal', hubs: 'Howrah Station, Nabanna, Kona Expressway', coords: [22.5958, 88.2636] },
  { name: 'Siliguri', state: 'West Bengal', hubs: 'Tenzing Norgay Bus Terminus, Darjeeling More, Bagdogra', coords: [26.7271, 88.3953] },
  { name: 'Durgapur', state: 'West Bengal', hubs: 'City Centre, Benachity, Muchipara', coords: [23.5204, 87.3119] },
  { name: 'Asansol', state: 'West Bengal', hubs: 'City Bus Stand, SBSTC Stand, GT Road', coords: [23.6889, 86.9661] },
  { name: 'Bhubaneswar', state: 'Odisha', hubs: 'Baramunda Bus Stand, Master Canteen, Patia, Airport', coords: [20.2961, 85.8245] },
  { name: 'Cuttack', state: 'Odisha', hubs: 'Badambadi Bus Stand, Link Road, OMP Square', coords: [20.4625, 85.8828] },
  { name: 'Puri', state: 'Odisha', hubs: 'Jagannath Temple, Grand Road, Sea Beach', coords: [19.8135, 85.8312] },
  { name: 'Ranchi', state: 'Jharkhand', hubs: 'Khadgarha Bus Stand, Ratu Road, Birsa Chowk', coords: [23.3441, 85.3096] },
  { name: 'Jamshedpur', state: 'Jharkhand', hubs: 'Mango Bus Stand, Bistupur, Sakchi', coords: [22.8046, 86.2029] },
  { name: 'Patna', state: 'Bihar', hubs: 'Meethapur Bus Stand, Bairiya ISBT, Gandhi Maidan, Saguna More', coords: [25.5941, 85.1376] },
  { name: 'Gaya', state: 'Bihar', hubs: 'Bodh Gaya, Railway Station, Bus Stand', coords: [24.7914, 85.0002] },
  { name: 'Guwahati', state: 'Assam', hubs: 'ISBT Betkuchi, Paltan Bazaar, Khanapara, Jalukbari', coords: [26.1445, 91.7362] },
  { name: 'Raipur', state: 'Chhattisgarh', hubs: 'Pandri Bus Stand, Telibandha, Tatibandh Chowk', coords: [21.2514, 81.6296] }
];

/** Fast normalized lookup map */
const CITY_COORDS_MAP = {};
INDIAN_CITIES.forEach(c => {
  const cleanName = c.name.toLowerCase().trim();
  CITY_COORDS_MAP[cleanName] = c.coords;
  // Also register state-qualified key e.g. "salem, tamil nadu"
  CITY_COORDS_MAP[`${cleanName}, ${c.state.toLowerCase()}`] = c.coords;
});

/**
 * Instant in-memory Geocode function.
 * Matches city name, state, and cleans extra punctuation.
 * Falls back to Nominatim only for unknown remote villages.
 */
export async function getCityCoordinates(cityStr) {
  if (!cityStr || typeof cityStr !== 'string') return null;

  const raw = cityStr.trim();
  const lower = raw.toLowerCase();

  // 1. Exact match in built-in dataset
  if (CITY_COORDS_MAP[lower]) {
    return CITY_COORDS_MAP[lower];
  }

  // 2. Strip commas and check primary city word (e.g. "Salem, Tamil Nadu" -> "salem")
  const primaryPart = lower.split(',')[0].trim();
  if (CITY_COORDS_MAP[primaryPart]) {
    return CITY_COORDS_MAP[primaryPart];
  }

  // 3. Partial match inside INDIAN_CITIES
  const matched = INDIAN_CITIES.find(c => 
    primaryPart.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(primaryPart)
  );
  if (matched) {
    return matched.coords;
  }

  // 4. Fallback to Nominatim with safety timeout and User-Agent
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(raw)}&limit=1&countrycodes=in`,
      { 
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal 
      }
    );
    clearTimeout(timeout);
    const d = await r.json();
    if (d && d.length > 0) {
      return [parseFloat(d[0].lat), parseFloat(d[0].lon)];
    }
  } catch {
    // Graceful fallback
  }

  // Default coordinate center (South / Central India)
  return null;
}

/**
 * Filter autocomplete suggestions from offline database instantly!
 */
export function searchIndianCities(query, maxResults = 8) {
  if (!query || query.trim().length === 0) return [];

  const clean = query.trim().toLowerCase();

  const exactMatches = [];
  const startMatches = [];
  const containMatches = [];
  const hubMatches = [];

  for (const c of INDIAN_CITIES) {
    const cName = c.name.toLowerCase();
    const cState = c.state.toLowerCase();
    const cHubs = c.hubs.toLowerCase();

    if (cName === clean) {
      exactMatches.push(c);
    } else if (cName.startsWith(clean)) {
      startMatches.push(c);
    } else if (cName.includes(clean) || cState.includes(clean)) {
      containMatches.push(c);
    } else if (cHubs.includes(clean)) {
      hubMatches.push(c);
    }
  }

  const combined = [...exactMatches, ...startMatches, ...containMatches, ...hubMatches];
  
  // Deduplicate
  const seen = new Set();
  const deduped = [];
  for (const item of combined) {
    if (!seen.has(item.name.toLowerCase())) {
      seen.add(item.name.toLowerCase());
      deduped.push({
        name: item.name,
        display: `${item.name}, ${item.state}`,
        hubs: item.hubs,
        coords: item.coords
      });
      if (deduped.length >= maxResults) break;
    }
  }

  return deduped;
}

/**
 * Calculates Haversine distance in km between two [lat, lon] points,
 * multiplied by an Indian road winding factor (1.22x) for realistic highway km.
 */
export function calculateRoadDistanceKm(coord1, coord2) {
  if (!coord1 || !coord2) return null;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const airDistance = R * c;

  // Indian national highway factor is typically 1.22 - 1.25x air distance
  return Math.round(airDistance * 1.22);
}
