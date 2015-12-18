//
//  ConferencesRequestTests.swift
//  CCCtv
//
//  Created by Kris Simon on 13/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import XCTest
import SwiftyJSON

class ConferencesRequestTests: XCTestCase {

    override func setUp() {
        super.setUp()

    }
    
    override func tearDown() {

        super.tearDown()
    }

    func testGetConferences() {
        var conderencesRequest = ConferencesRequest()
        
        let readyExpectation = expectationWithDescription("ready")
        
        conderencesRequest.performRequest(){ (err: RequestError?, data: JSON?)->() in
            XCTAssertNil(err)
            XCTAssertNotNil(data)
            
            XCTAssertEqual(data!.type, Type.Dictionary)
            XCTAssertTrue(data!.count > 0)
            
            XCTAssertEqual(data!["conferences"].type, Type.Array)
            
            readyExpectation.fulfill()
            
        }

        waitForExpectationsWithTimeout(10, handler: { error in
            XCTAssertNil(error, "Error in Expectations")
            
        })
    }

}
