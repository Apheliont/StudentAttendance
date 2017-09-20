function init() {

  function studentAttendance(studentsArr) {
    let model = {
      data: [],
    };


    let view = {
      init: function() {
        // table header part
        let that = this;
        let students = controller.getStudents();
        let numberOfDays = students[0].days.length;
        this.studentNameHead = document.querySelector('.name-col');
        this.student = document.querySelector('.student');
        this.studentsTable = document.querySelector('.student-table');

        let str = '';
        for(let i = 1; i <= numberOfDays; i++) {
          str += '<th>' + i + '</th>';
        }
        this.studentNameHead.insertAdjacentHTML('afterEnd', str);

        // table students part
        students.forEach(function(student, number){
          that.studentsTable.appendChild(makeStudent(student, number));
        });

          function makeStudent(student, number) {
            let studentRow = document.createElement('tr');
            let studentNameColumn = document.createElement('td');
            let studentMissedColumn = document.createElement('td');

            studentMissedColumn.classList.add('missed-col');
            studentNameColumn.classList.add('name-col');
            studentRow.classList.add('student');

            studentNameColumn.textContent = student.name;
            studentRow.appendChild(studentNameColumn);

            for(let i = 0; i < student.days.length; i++) {
              let checkbox = document.createElement('input');
              let studentAttendColumn = document.createElement('td');
              studentAttendColumn.classList.add('name-col');

              checkbox.type = 'checkbox';
              checkbox.checked = student.days[i];
              checkbox.addEventListener('click', (function(dayNum, studentNum) {
                return function(e) {
                  let isMissed = e.target.checked;
                  controller.setStudentDay(isMissed, studentNum, dayNum);
                  controller.saveModel();
                  that.render(studentNum);
                };
              })(i, number));

              studentAttendColumn.appendChild(checkbox);
              studentRow.appendChild(studentAttendColumn);
            }
            studentMissedColumn.textContent = controller.getMissedDays(number);
            studentRow.appendChild(studentMissedColumn);
            return studentRow;
          }

      },

      render: function(studentNumber) {
        this.studentsTable.children[studentNumber].lastElementChild.textContent = controller.getMissedDays(studentNumber);
      }
    };


    let controller = {
      init: function() {
        this.initModel();
        view.init();
      },
      initModel: function() {
        if (!this.restoreModel()) {
          model.data = studentsArr;
        }
        model.numberOfDays = model.data[0].days.length;
      },
      saveModel: function() {
        localStorage.setItem('studentAttendance', JSON.stringify(model));
      },
      restoreModel: function() {
        let savedModel = localStorage.getItem('studentAttendance');
        if (savedModel) {
          model = JSON.parse(savedModel); return true;
        } else {
          return false;
        }
      },
      getStudents: function() {
        return model.data;
      },
      getMissedDays: function(studentNumber) {
        let filteredArr = model.data[studentNumber].days.filter(function(day){return !day;});
        return filteredArr.length;
      },
      setStudentDay: function(isMissed, studentNum, dayNum) {
        model.data[studentNum].days[dayNum] = isMissed;
      }
    };
    controller.init();
  }


  let studentsArr = [
    {name: 'Мища', days: [true, false, true, false, false, false, true, true]},
    {name: 'Петя', days: [false, false, false, false, true, false, true, false]},
    {name: 'Даша', days: [true, true, true, true, false, false, true, true]},
    {name: 'Света', days: [false, true, true, true, false, false, true, false]},
    {name: 'Андрей', days: [false, false, true, false, true, true, false, false]}
  ];

  studentAttendance(studentsArr);
}

window.addEventListener('DOMContentLoaded', init);
