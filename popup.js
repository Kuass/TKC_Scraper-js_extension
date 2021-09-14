window.onload = function () {
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.getElementById('start_scrap').addEventListener('click', function () {
        chrome.tabs.executeScript({
            code: 'document.getElementsByClassName("g2w_playerCard__gamerTag--container")[0].children[0].children[0].innerText'
        }, function (result) {
            seasons_scrap_1(result);
        });
    });
};

window.addEventListener('click', function (e) {
    if (e.target.href !== undefined) {
        chrome.tabs.create({
            url: e.target.href
        })
    }
})

var data = [];
var nickname = "";
var level = "";
function seasons_scrap_1(_nickname) {
    nickname = _nickname[0];
    chrome.tabs.executeScript({
        code: 'document.getElementsByClassName("g2w_playerCard__stats-wrap")[0].children[1].children[1].innerText'
    }, function (result) {
        seasons_scrap_2(result);
    });
}

function seasons_scrap_2(_level) {
    level = _level[0];

    chrome.tabs.executeScript({
        code: 'var seasons_ul = document.getElementsByClassName("g2w__season-selector__seasons")[0].children;seasons_ul.length;'
    }, function (result) {
        seasons_scrap_3(result);
    });
}

var global_length = 23;
function seasons_scrap_3(length) {
    global_length = length;
    for (var i = 0; i < length; i++) {
        seasons_scrap_3_1(i)
    }

    seasons_scrap_4()
}

function seasons_scrap_3_1(index) {
    setTimeout(function () {
        var jscode = "seasons_ul["+index+"].click();" +
            "if(document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[4].children[1].innerText.length > 20) { " +
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[0].innerText } else { " +
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[0].innerText + \"|\" + " + // Season
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[4].children[1].innerText + \"|\" + " + // LastMMR
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[1].children[0].children[1].innerText + \"|\" + " + // LastRank
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[1].children[1].children[1].innerText + \"|\" + " + // MaxRank
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[1].children[2].children[1].innerText + \"|\" + " + // PlayTime
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[1].children[3].children[1].innerText + \"|\" + " + // Matches
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[0].children[0].children[1].innerText + \"|\" + " + // KDA
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[1].children[5].children[1].innerText + \"|\" + " + // KPR
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[1].children[6].children[1].innerText + \"|\" + " + // Kills
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[1].children[7].children[1].innerText + \"|\" + " + // Deaths
            "document.getElementsByClassName(\"g2w__box--seasons-detail\")[0].children[5].children[1].children[4].children[1].innerText" + // Win%
        "}"
        chrome.tabs.executeScript({
            code: jscode
        }, function (result) {
            console.log(result)
            seasons_scrap_3_2(result[0])
        });
    }, index * 300)
}

function seasons_scrap_3_2(element) {
    var split_element = element.split("|")
    if (split_element.length < 3) {
        data.push({
            Season: split_element[0],
            NickName: nickname,
            LastMMR: "N/A",
            LastRank: "N/A",
            MaxRank: "N/A",
            PlayTime: "N/A",
            Matches: "N/A",
            KDA: "N/A",
            KPR: "N/A",
            Kills: "N/A",
            Deaths: "N/A",
            WinPer: "N/A"
        });
    } else {
        data.push({
            Season: split_element[0],
            NickName: nickname,
            LastMMR: split_element[1],
            LastRank: split_element[2],
            MaxRank: split_element[3],
            PlayTime: split_element[4],
            Matches: split_element[5],
            KDA: split_element[6],
            KPR: split_element[7],
            Kills: split_element[8],
            Deaths: split_element[9],
            WinPer: split_element[10]
        });
    }
}

function seasons_scrap_4() {
    if (global_length <= data.length) {
        var ws = XLSX.utils.json_to_sheet(data, {
            header: ['Season', 'NickName', 'LastMMR', 'LastRank', 'MaxRank', 'PlayTime', 'Matches', 'KDA', 'KPR', 'Kills', 'Deaths', 'WinPer']
        });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, nickname);
        XLSX.writeFile(wb, "UbiStatsScrap-" + nickname + "(Lv_" + level + ").xlsx");
    } else {
        setTimeout(function () {
            console.log("nope");
            seasons_scrap_4();
        }, 500);
        return;
    }
}