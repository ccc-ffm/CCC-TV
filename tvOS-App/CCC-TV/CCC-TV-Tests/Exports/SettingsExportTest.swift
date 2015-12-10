//
//  SettingsExportTest.swift
//  CCC-TV
//
//  Created by Kris Simon on 10/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import XCTest
//@testable import CCCtv

class SettingsExportTest: XCTestCase {

    override func setUp() {
        super.setUp()
        
    }
    
    override func tearDown() {
        
        
    }

    func testGetItem() {
        let si = SettingsExport()
        si.setItem("first key", data: "foo")
        let value = si.getItem("first key")
        XCTAssertEqual(value, "foo")
        
    }

}
