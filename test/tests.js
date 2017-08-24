var chai = require('chai');
var expect = chai.expect
var {
  convertDomains,
  convertStudentData,
  getLearningPath,
  minInObj,
  pathsToCsv,
} = require('../create_learning_paths.js')




describe('convertCSVData', function(){
  describe('convertDomains', function(){
    let originalArr = [
      ['heading1', 'a', 'b'],
      ['heading2', 'c', 'd']
    ]
    let domObjs = convertDomains(originalArr)
    it('should accept an array of arrays and return an object', function(){
      expect(typeof(domObjs)).to.be.equal('object')
    })
    it('should have keys that correspond to the 0 indexes of the original arrays', function(){
      expect(Object.keys(domObjs).toString()).to.be.equal([originalArr[0][0], originalArr[1][0]].toString())
    })
    it('should have arrays for each key whose values match the remaining values (beyond the 0 index) of the original arrays', function(){
      expect(domObjs['heading1'].toString()).to.be.equal(originalArr[0].slice(1).toString())
    })
  })
  describe('convertStudentData', function(){
    let originalArr = [
      ['Student Name', 'RF', 'RL', 'RI', 'L'],
      ['Jean-Luc', '2','3','K','3'],
      ['Worf', '4', '2','1', '1'],
      ['Riker', 'K', '4', '1', '2'],
      ['Deanna', '4', '3', '3', 'K'],
      ['Geordi', '1', '5', '5', '3'],
      ['Beverly', '5', '2', '3', '4'],
      ['Data']
    ]
    let studObjs = convertStudentData(originalArr)
    it('should accept an array of arrays and return an array of objects', function(){
      expect(Array.isArray(studObjs)).to.be.equal(true)
      expect(typeof(studObjs[0])).to.be.equal('object')
    })
    it('should have objects whose keys correspond to the values in the array at index 0 of the original array', function(){
      expect(Object.keys(studObjs[1]).toString()).to.be.equal(originalArr[0].toString())
    })
    it('converts non-numerical values for grade levels to numerical ones ("K" becomes "0")', function() {
      expect(studObjs[2]['RF']).to.be.equal('0')
    })
    it('assigns a student "K" (a.k.a. "0") level test data if no test data is available for that student', function() {
      expect(studObjs[6].toString()).to.be.equal({ 'Student Name': 'Data', RF: '0', RL: '0', RI: '0', L: '0' }.toString())
    })
  })
})

describe('getTheLearningPaths', function(){
  describe('minInObj', function(){
    let testObj = {'key1': 'a', 'key2': 'b', 'key3': '1', 'key4': '2'}
    it('takes in an object and outputs the key that contains the lowest alphanumeric value', function(){
      expect(minInObj(testObj)).to.be.equal('key3')
    })
  })
  describe('getLearningPath', function(){
    let doms = {
      '0': [ 'RF', 'RL', 'RI' ],
      '1': [ 'RF', 'RL', 'RI' ],
      '2': [ 'RF', 'RI', 'RL', 'L' ],
      '3': [ 'RF', 'RL', 'RI', 'L' ],
      '4': [ 'RI', 'RL', 'L' ],
      '5': [ 'RI', 'RL', 'L' ],
      '6': [ 'RI', 'RL' ]
    }
    let student1 = {
      'Student Name': 'Beverly',
      RF: '5',
      RL: '2',
      RI: '3',
      L: '4'
    }
    let student2 = {
      'Student Name': 'Data',
      RF: '6',
      RL: '5',
      RI: '6',
      L: '6'
    }
    it('takes in a student object and a domain object and outputs an array with a length of 6 if the student has not passed all the levels', function(){
      let bevsLearningPath = getLearningPath(student1, doms)
      expect(bevsLearningPath.length).to.be.equal(6)
      expect(bevsLearningPath.toString()).to.be.equal('Beverly,2.RL,3.RL,3.RI,4.RL,4.RI')
    })
    it('outputs an array less than a length of 6 if some or all levels are passed', function(){
      let datasLearningPath = getLearningPath(student2, doms)
      expect(datasLearningPath.length).to.be.equal(4)
    })
  })
})

describe('convertDataToCSV', function(){
  describe('pathsToCsv', function(){
    it('takes in an array of arrays of student learning paths and converts it to CSV format', function() {
      let testPaths = [
        [ 'Worf', '1.RL', '1.RI', '2.RL', '2.RI', '2.L' ],
        [ 'Deanna', 'K.RF', '0.RL', '1.RF', '1.RL', '1.RI' ],
        [ 'Geordi', '2.RF', '3.RF', '4.RL', '4.RI', '4.L' ]
      ]
      let csvTestPaths = pathsToCsv(testPaths)
      expect(csvTestPaths.toString().replace(new RegExp('\n', 'g'), ',')).to.be.equal('Worf,1.RL,1.RI,2.RL,2.RI,2.L,Deanna,K.RF,0.RL,1.RF,1.RL,1.RI,Geordi,2.RF,3.RF,4.RL,4.RI,4.L')
    })
  })
})
