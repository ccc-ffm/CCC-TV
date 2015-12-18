//
//  CensoredEventList.swift
//  CCCtv
//
//  Created by Kris Simon on 18/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import Foundation

struct CensoredEvent {
    let guid: String
}

let censoredEventList: [CensoredEvent] = [
    // Hardware attacks: hacking chips on the (very) cheap
    CensoredEvent(guid: "0e66ac36-d9c6-4900-b532-4f651dd39582")

    // Bluetooth Hacking - The State of The Art
    , CensoredEvent(guid: "import-0243ea368590839b2d")
    
    // Hacking Medical Devices
    , CensoredEvent(guid: "qhHYA8W5FgbkHqAdYePmEQ")
    
    // Gamehacking & Reverse Engineering
    , CensoredEvent(guid: "83b785ad-0882-4552-9ad4-0cde123f3837")
    
    // Crypto-Hacking Export restrictions
    , CensoredEvent(guid: "4a9bf7495fd14b4e4ac986bc0a27106b")
    
    // Jailbreak: eine Einführung
    , CensoredEvent(guid: "1q4jAFZgpy0xvFH-XpS70g")

    // Social Engineering und Industriespionage
    , CensoredEvent(guid: "5098bd46-1d93-4d43-b453-5686b68c09b3")
    
    // $kernel->infect(): Creating a cryptovirus for Symfony2 apps
    , CensoredEvent(guid: "8aEWrEVhtLj9lhnVjRTNqQ")
    
]

