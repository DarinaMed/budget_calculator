import EventEmitter from './eventEmitter.js';

const calendarEl = document.querySelector('.calendar');
const calendarDayList = calendarEl.querySelector('.calendar__day-list');
const calendarDayTitle = calendarEl.querySelector('.calendar__month-title');
const prevBtn = calendarEl.querySelector('.calendar__prev-btn');
const nextBtn = calendarEl.querySelector('.calendar__next-btn');

const currentDate = new Date();
const displayDate = null;
const MONTHES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

currentDate.setHours(0);
currentDate.setMinutes(0);
currentDate.setSeconds(0);
currentDate.setMilliseconds(0);

let myEmitter; 
export default myEmitter = new EventEmitter();

let calendarDays;
export let { month: calendarMonth, year: calendarYear } = getCurrentMonthAndYear();

generateCalendarData(calendarMonth, calendarYear);
renderCalendar();


prevBtn.addEventListener('click', shiftCalendarHandler(-1));

nextBtn.addEventListener('click', shiftCalendarHandler(1));

/**
 * @param {number} shiftMonth
 *
 * @return {function}
 */
function shiftCalendarHandler(shiftMonth) {
    return function() {
        shiftCalendar(shiftMonth);
    };
}

/**
 * @param {number} shiftMonth
 */
function shiftCalendar(shiftMonth) {
    const { month, year } = getShiftedMonthAndYear(calendarMonth, calendarYear, shiftMonth);

    generateCalendarData(month, year);
    renderCalendar();
}

function generateCalendarData(month, year) {
    calendarMonth = month;
    calendarYear = year;
    calendarDays = getCalendarDays(calendarMonth, calendarYear);
}

/**
 * @param {number} calendarMonth
 * @param {number} calendarYear
 * @param {number} [shiftMonth=0]
 * @param {number} [shiftYear=0]
 *
 * @return { month: number, year: number }
 */
function getShiftedMonthAndYear(calendarMonth, calendarYear, shiftMonth = 0, shiftYear = 0) {
    const d = new Date(calendarYear + shiftYear, calendarMonth + shiftMonth, 10);

    return {
        month: d.getMonth(),
        year: d.getFullYear(),
    };
}

/**
 * @return { month: number, year: number }
 */
function getCurrentMonthAndYear() {
    const currentDate = new Date();

    return {
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
    };
}

/**
 * @param {number} month
 * @param {number} year
 *
 * @return Date[]
 */
function getCalendarDays(month, year) {
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month+1, 0);
    const lastDayOfMonthNumber = lastDayOfMonth.getDate();
    const firstDayWeekOfMonth = firstDayOfMonth.getDay();
    const startShift = firstDayWeekOfMonth > 0 ? firstDayWeekOfMonth - 1 : firstDayWeekOfMonth - 6;
    const lastDayWeekOfMonth = lastDayOfMonth.getDay();
    const endShift = lastDayWeekOfMonth === 0 ? 0 : 7 - lastDayWeekOfMonth;

    for (
        let currentDayNumber = 1 - startShift;
        currentDayNumber <= lastDayOfMonthNumber + endShift;
        currentDayNumber++) {
        days.push(new Date(year, month, currentDayNumber));
    }

    return days;
}

/**
 * @param {Date} d
 *
 * @result {string} 'YYYY-MM-DD'
 */
function date2String(d) {
    const fullYear = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    return [
        fullYear.toString(),
        month.toString().padStart(2, '0'),
        day.toString().padStart(2, '0')
    ].join('-');
}

/**
 * @param {Date} calendarDay
 * @param {boolean} notInCurrentMonth
 * @param {boolean} current
 * @param {boolean} display
 *
 * @return {HTMLElement}
 */
function createDayEl(calendarDay, notInCurrentMonth, current, display) {
    const rootEl = document.createElement('li');
    const linkEl = document.createElement('a');

    rootEl.append(linkEl);

    linkEl.href = `?day=${date2String(calendarDay)}`;
    linkEl.className = 'calendar__day-link';
    linkEl.innerText = calendarDay.getDate();

    rootEl.className = 'calendar__day';

    if (notInCurrentMonth) {
        rootEl.classList.add('calendar__day--not-in-current-month');
    }

    if (current) {
        rootEl.classList.add('calendar__day--current');
    }

    if (display) {
        rootEl.classList.add('calendar__day--display');
    }

    return rootEl;
}

/**
 *
 * @param {Date[]} calendarDays
 * @param {number} calendarMonth
 * @param {Date} currentDate
 * @param {Date | null} displayDate
 *
 * @return void
 */
function renderDays(calendarDays, calendarMonth, currentDate, displayDate) {
    const days = calendarDays
        .map(calendarDay => createDayEl(
            calendarDay,
            calendarDay.getMonth() !== calendarMonth,
            calendarDay.getTime() === currentDate.getTime(),
            !!displayDate && displayDate.getTime() === calendarDay.getTime()
        ));

    calendarDayList.append(...days);
}

/**
 * @param {number} calendarMonth
 * @param {number} calendarYear
 */
function renderTitle(calendarMonth, calendarYear) {
    calendarDayTitle.innerText = `${MONTHES[calendarMonth]} ${calendarYear}`;
}

function clearCalendarDays() {
    calendarDayList.innerText = '';
}

function renderCalendar() {
    clearCalendarDays();
    renderDays(calendarDays, calendarMonth, currentDate, displayDate);
    renderTitle(calendarMonth, calendarYear);
	myEmitter.dispatch('renderHistory');
}
