var regexp = /<string[^>]*>[^<]*?<\/string>/gi; //Нахождение всех полей string
var regexp2 = /(<string[\s\S]*?name="([^"]*?)"[\s\S]*?>)([^<]*?)<\/string>/i; //Разбиение поля [<string...>, name value, value]
var names = [];
var strings = [];
var values = [];

function find() {
    var found = document.getElementById("input").value.match(regexp);
    var length = found.length;
    for (var i = 0; i < length; i++) {
        var matches = found[i].match(regexp2);
        strings.push(matches[1]);
        names.push(matches[2]);
        values.push(matches[3]);
    }

    //Сортировка по name, с "привязкой" к остальным полям
    length = names.length;
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < (length - i - 1); j++) {
            if (names[j] > names[j + 1]) {
                var tmp = names[j];
                names[j] = names[j + 1];
                names[j + 1] = tmp;

                tmp = strings[j];
                strings[j] = strings[j + 1];
                strings[j + 1] = tmp;

                tmp = values[j];
                values[j] = values[j + 1];
                values[j + 1] = tmp;
            }
        }
    }
    //Строка с value для перевода
    var toTranslate = values.join('.\n') + '.';
    //Экранирование спецю.символов и переменных
    toTranslate = toTranslate.replace(/(\\\w)/gi, '|||$1|||').replace(/(%\w)/gi, '|||$1|||');
    //Записываем значения в поле для перевода
    document.getElementById("out_to_translate").value = toTranslate;

    //Вывод сортировки
    var result = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
    for (var i = 0; i < strings.length; i++)
        result += '\t' + strings[i] + values[i] + '<\/string\n';
    result += '<\/resources>';
    document.getElementById("output").value = result;
}

function replaceValues() {
    //Берем значения из поля с переведенными значениями
    var toTranslate = document.getElementById("in_to_translate").value;
    //"Вскрываем" экранирование
    toTranslate = toTranslate.replace(
        /\|\|\|(\\\w)\|\|\|/gi, '$1').replace(/\|\|\|(%\w)\|\|\|/gi, '$1')
    var newValues = toTranslate.split(".\n");

    //Вывод перевода
    var result = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
    //Тернарный оператор используется для исключения полей с переведенными переменными
    for (var i = 0; i < strings.length; i++)
        result += '\t' + strings[i] + (
            /@[^\/]*\//i.test(newValues[i]) ? values[i] : newValues[i]) + '<\/string\n';
    result += '<\/resources>';
    document.getElementById("output_translated").value = result;
}
