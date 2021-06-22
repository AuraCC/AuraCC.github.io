function loadJSON(filePath) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json")
    xobj.open('GET', filePath, false)
    xobj.send()
    if (xobj.readyState == 4 && xobj.status == 200) {
        return JSON.parse(xobj.responseText)
    }
}

function init() {
    points = loadJSON('https://raw.githubusercontent.com/smaldragon/AURA/main/points.json')
    computed = loadJSON('https://raw.githubusercontent.com/smaldragon/AURA/main/computed.json')

    a = document.getElementById("stations")
    sl = document.getElementById("station-list")
    for (i in points) {
        if (['stop','stopjunction','junctionstop'].includes(points[i].type)) {
            o = document.createElement("option")
            p = document.createElement("p")
            n = points[i].name
            nm = ''
            if (typeof n === 'string') {
                nm = n
            } else {
                nm = n[0]
            }
            o.value = nm
            p.innerHTML = nm
            a.appendChild(o)
            sl.appendChild(p)
        }
    }
}

points = []
window.onload = init

start = ''
end   = ''

function find_station(s) {
    s = s.toLowerCase()
    if (Object.keys(points).includes(s)) {
        return s
    } else {
        for (id in points) {
            point = points[id]
            if (point.name != null) {
            if (typeof point.name === 'object') {
                for (al in point.name) {
                    if (point.name[al].toLowerCase() == s) {
                        return id
                    } 
                }
            } else {
                if (point.name.toLowerCase() == s) {
                    return id
                }
            }
            }
            if ('dest' in point) {
            if (point.dest.toLowerCase() == s) {
                return id
            }
            }
        }
    }
    return ''
}

function find_path() {
    dest_txt = ''
    if (start != '' && end != '') {
        dest_txt = computed[start+' - '+end]
    }
    p = document.getElementById("command")
    p.innerHTML = dest_txt
}

function update_start(val) {
    start = find_station(val)
    find_path()
}
function update_end (val) {
    end = find_station(val)
    find_path()
}