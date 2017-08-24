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


var domainsArr = new Promise(function(resolve, reject){
  fs.readFile('./data/domain_order.csv', function (err, fileData) {
    parse(fileData, {delimiter: ',', rowDelimiter: '\n', relax_column_count: true }, function(err, rows) {
      if(err){ reject(err) }
      console.log("ROWWS", rows)
      resolve(rows)
    })
  })
})



Promise.all([studentData, domainsArr])
  .then(data => {
    let domainsObjArr = convertDomains(data[1])
    let studentObjArr = convertStudentData(data[0]);
    getLearningPaths(studentObjArr, domainsObjArr)
  })


let allLearningPaths = [];



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
  pathsToCsv(allLearningPaths)
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


function pathsToCsv(allCompletePaths){
  let csvContent = []
  allCompletePaths.forEach((studentInfo, idx) => {
    let line = studentInfo.join(',')
    // csvContent.push(idx === 0 ? 'data:text/csv;charset=utf-8,' + line : line)
    csvContent.push(line)
  })
  let csvPaths = csvContent.join('\n')
  console.log(csvPaths)
  exportCsv(csvPaths)
}

function exportCsv(paths){
  fs.writeFile(__dirname + '/csvPaths/paths_output.csv', paths, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
}
