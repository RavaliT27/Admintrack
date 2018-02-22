/**
 * Traditional Chinese translation for bootstrap-datepicker
 * Rung-Sheng Jang <daniel@i-trend.co.cc>
 * FrankWu  <frankwu100@gmail.com> Fix more appropriate use of Traditional Chinese habit
 */
;
(function ($) {
    $.fn.datepicker.dates['zh-TW'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六", "週日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "�?月", "�??月", "�??一月", "�??二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "�?月", "�??月", "�??一月", "�??二月"],
        today: "今天",
        format: "yyyy年mm月dd日",
        weekStart: 1
    };
}(jQuery));
