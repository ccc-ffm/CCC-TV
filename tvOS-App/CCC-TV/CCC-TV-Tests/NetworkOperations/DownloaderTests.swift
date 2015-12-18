//
//  DownloaderTests.swift
//  CCCtv
//
//  Created by Kris Simon on 13/12/15.
//  Copyright © 2015 aus der Technik. All rights reserved.
//

import XCTest

class DownloaderTests: XCTestCase {

    override func setUp() {
        super.setUp()
        allConferences.removeAll()
    }
    
    override func tearDown() {

        super.tearDown()
    }

    func testDownload() {
        let downloader = Downloader()
        let readyExpectation = expectationWithDescription("ready")
        
        XCTAssertTrue(allConferences.count == 0)
        
        downloader.performDownload(){
            readyExpectation.fulfill()
        }
        
        waitForExpectationsWithTimeout(10, handler: { error in
            XCTAssertNil(error, "Error in Expectations")
            XCTAssert(allConferences.count > 0)
        })
    }

    func testDoubleDownload() {
        let downloader = Downloader()
        let readyExpectation = expectationWithDescription("ready")
        
        XCTAssertTrue(allConferences.count == 0)
        
        downloader.performDownload(){
            let firstDownloadCount = allConferences.count
            downloader.performDownload(){
                let secondDownloadCount = allConferences.count
                
                XCTAssertEqual(firstDownloadCount, secondDownloadCount)
                readyExpectation.fulfill()
            }
            
        }
        
        waitForExpectationsWithTimeout(10, handler: { error in
            XCTAssertNil(error, "Error in Expectations")
            XCTAssert(allConferences.count > 0)
        })
    }
    
    func testConferenceSorting() {
        let downloader = Downloader()
        let readyExpectation = expectationWithDescription("ready")
        
        downloader.performDownload(){
            XCTAssert(allConferences.count > 2)
            
            print("DATE 1 : \(allConferences.first!.updated_at)")
            print("DATE 2 : \(allConferences.last!.updated_at)")
            
            XCTAssertTrue(allConferences.last!.updated_at.timeIntervalSinceDate(allConferences.first!.updated_at) <= 0)
            
            readyExpectation.fulfill()
        }
        
        waitForExpectationsWithTimeout(10, handler: { error in
            XCTAssertNil(error, "Error in Expectations")
            
        })
    }

}
