const fs = require('fs')
var parse = require('csv-parse')




var studentData = new Promise(function(resolve, reject){
  fs.readFile('./data/student_tests.csv', function (err, fileData) {
    parse(fileData, {delimiter: ',', rowDelimiter: '\n' }, function(err, rows) {
      if(err){ reject(err) }
      resolve(rows)
    })
  })
})


////I'm having a hard time finding a javascript CSV parser
////that can deal with an inconsistent number of columns-
////the one I'm using here rejects the promise for that reason,
////so, instead, I'm using the domainsArr below as a stand-in

// var domainOrder = new Promise(function(resolve, reject){
//   fs.readFile('./data/domain_order.csv', function (err, fileData) {
//     parse(fileData, {delimiter: ',', rowDelimiter: '\n' }, function(err, rows) {
//       if(err){ reject(err) }
//       resolve(rows)
//     })
//   })
// })

var domainsArr = [
  [ 'K', 'RF', 'RL', 'RI' ],
  [ '1', 'RF', 'RL', 'RI' ],
  [ '2', 'RF', 'RI', 'RL', 'L' ],
  [ '3', 'RF', 'RI', 'RL', 'L' ],
  [ '4', 'RI', 'RL', 'L' ],
  [ '5', 'RI', 'RL', 'L' ],
  [ '6', 'RI', 'RL']
]


Promise.all([studentData])
  .then(data => {
    return data[0];
  })
  .then(studentDataArr =>{
    let domainsObjArr = convertDomains(domainsArr)
    let studentObjArr = convertStudentData(studentDataArr);
    getLearningPaths(studentObjArr, domainsObjArr)
  })


let allLearningPaths = [];

// var stuData = [
//   ['Student Name', 'RF', 'RL', 'RI', 'L'],
//   ['Jean-Luc', '2','3','K','3'],
//   ['Worf', '4', '2','1', '1'],
//   ['Riker', 'K', '4', '1', '2'],
//   ['Deanna', '4', '3', '3', 'K'],
//   ['Geordi', '1', '5', '5', '3'],
//   ['Beverly', '5', '2', '3', '4'],
// ]


function convertDomains(domsArr){
  let convtDoms = {};
  domsArr.map(level => {
    if (level[0] === 'K'){
      let sillyZero = '0';
      convtDoms[sillyZero] = level.slice(1)
    } else {
      convtDoms[level[0]] = level.slice(1)
    }

  })
  return convtDoms;
}


function convertStudentData(studentData){
  let converted = [];
  for (let i = 1; i < studentData.length; i++){
    let studentObj = {};
    for (let j = 0; j < studentData[i].length; j++){
      if (studentData[i][j] === 'K'){
        studentObj[studentData[0][j]] = '0'
      } else {
        studentObj[studentData[0][j]] = studentData[i][j]
      }
    }
    converted.push(studentObj)
  }
  return converted;
}



function getLearningPaths(students, domains){
  students.map(student => {
    let learningPath = getLearningPath(student, domains)
    allLearningPaths.push(learningPath)
  })
  console.log("uh", allLearningPaths)
}


function getLearningPath(studentObj, doms){
  let path = [];
  let highestLevel = Object.keys(doms).length

  while (path.length < 5){
    let lowestDom = minInObj(studentObj);
    let lowestScore = studentObj[lowestDom]

    if (lowestScore > highestLevel){
      break;
    }
    if (doms[lowestScore].includes(lowestDom)){
      path.push(lowestScore + '.' + lowestDom)
      lowestScore++;
      studentObj[lowestDom] = lowestScore;
    } else {
      lowestScore++;
      studentObj[lowestDom] = lowestScore++;
    }
  }

  let okPath = path.toString().replace('0', 'K').replace(/\\/g,"'").split(',') //small issue- the parser changes the "'" in names like O'Connell to O\ Connell
  let completePath = [studentObj['Student Name']].concat(okPath)

  return completePath;
}


//This finds the domain with the lowest score in a row of student data
function minInObj(obj){
  let lowestKey = Infinity;
  let output = ''
  Object.keys(obj).map(key=>{
    if (Number(obj[key]) < lowestKey){
      lowestKey = Number(obj[key]);
      output = key;
    }
  })
  return output;
}
