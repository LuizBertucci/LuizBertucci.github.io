/**
 * Generate laptop cards
 */
function makeCard(props) {
    $card = $("<div class='card'></div>");
    $cardImage = $(`<div class='card-image' onclick=$('#modal-${props.modalReference}').modal('open')></div>`);
    $cardContent = $(`<div class='card-content center-align' onclick=$('#modal-${props.modalReference}').modal('open')></div>`);
    $linkList = $("<div class='card-content center-align'><h5>Ir à loja:</h5></div>'");
    $linkListContent = $("<ul></ul>");

    $cardImage.append(`<img class='vendor-image' src='${props.imagem}'></img>`);
    $cardContent.append("<span class='card-title'>" + props.marca + " " + props.modelo + "</span><a class='grey-text' href='#!'>Ver detalhes</a>");


    if (props.preco !== "Carregando…") {
        $cardContent.append("<h4>" + props.preco + "</h4>");
    }

    if (props.linkAmericanas !== "") {
        $linkList.append("<a href=" + props.linkAmericanas + " target='_blank' class='red waves-effect waves-light btn espacamento'>Americanas</a>");
    }

    if (props.linkSubmarino !== "") {
        $linkList.append("<a href=" + props.linkSubmarino + " target='_blank' class='light-blue waves-effect waves-light btn espacamento'>Submarino</a>");
    }

    $linkList.append($linkListContent);

    $card.append($cardImage);
    $card.append($cardContent);
    $card.append("<div class='divider'></div>");
    $card.append($linkList);

    return $card;
}

/**
 * Generate laptop details modal
 */
function makeModal(props) {
    $modalBody = $(`<div id='modal-${props.modalReference}' class='modal modal-fixed-footer' tabindex='0'></div>`);
    $modalContent = $(`<div class='modal-content'><h4>Detalhes</h4></div>`);
    $modalFooter = $("<div class='modal-footer'><a class='modal-close waves-effect waves-blue btn-flat'>Fechar</a></div>");

    $modalTableBody = $('<table class=striped></table>');
    $modalContentTable = $('<tbody></tbody>');

    $detailsList = ["marca", "processador", "ram", "tela", "peso", "hd", "ssd", "cor", "placadevideo", "os", "modelo"];
    $whatIsWhat = ["Fabricante", "Processador", "Memória RAM", "Tamanho da tela", "Peso", "HD", "SSD", "Cor", "Placa de vídeo", "Sistema operacional", "Modelo"];
    for (let i = 0; i < $detailsList.length; i++) {
        if (props[$detailsList[i]] !== "" && props[$detailsList[i]] !== "Não possui" && props[$detailsList[i]] !== "Não") {
            $modalContentTable.append(`<tr><td>${$whatIsWhat[i]}</td><td>${props[$detailsList[i]]}</td></tr>`);
        }
    }
    $modalTableBody.append($modalContentTable);
    $modalContent.append($modalTableBody);

    $modalBody.append($modalContent);
    $modalBody.append($modalFooter);

    return $modalBody;
}

/**
 * Generate filter labels
 */
function makeFilter(props, place) {
    $filter = [];

    for (var i = 0; i < props.length; i++) {
        if (props[i].tipo === 'checkbox') {
            if (props[i].desc !== '') {
                $filter.push($(`<a><label><input id='${props[i].tag.replace(/ /g, '-')}' class='filled-in' type='checkbox'/><span id='${props[i].tag.replace(/ /g, '-')}-span' for='${props[i].tag.replace(/ /g, '-')}' onclick='checkBox(this.innerHTML)'>${props[i].tag}</span></label></a>`));
            } else {
                $filter.push($(`<a><label><input id='${props[i].tag.replace(/ /g, '-')}' class='filled-in' type='checkbox'/><span id='${props[i].tag.replace(/ /g, '-')}-span' for='${props[i].tag.replace(/ /g, '-')}' onclick='checkBox(this.innerHTML)'>${props[i].tag}</span></label></a>`));
            }
        } else if (props[i].tipo === 'radio') {
            if (props[i].tag === 'todos') {
                $filter.push($(`<a><label><input id='${props[i].tag.replace(/ /g, '-')}-${place}' class='with-gap' name='group-${place}' type='radio' checked/><span id='${props[i].tag.replace(/ /g, '-')}-${place}-span' for='${props[i].tag.replace(/ /g, '-')}-${place}' onclick="radioTreatment('${place}','${props[i].tag}')">${props[i].tag}</span></label></a>`));
                $lastRadioClicked[place] = '';
            } else {
                $filter.push($(`<a><label><input id='${props[i].tag.replace(/ /g, '-')}-${place}' class='with-gap' name='group-${place}' type='radio'/><span id='${props[i].tag.replace(/ /g, '-')}-span' for='${props[i].tag.replace(/ /g, '-')}-${place}' onclick="radioTreatment('${place}','${props[i].tag}')">${props[i].tag}</span></label></a>`));
            }
        }
    }
    $('.tooltipped').tooltip();

    return $filter;
}

$notebooks = [];
$notebooksByPrice = [];
$notebooksFiltered = [];
$tags = {};
$tagsChecked = [];
$lastRadioClicked = {};

/**
 * Get tags from sheets
 */
$.getJSON("https://cors-anywhere.herokuapp.com/https://spreadsheets.google.com/feeds/list/1xDHAlrMEv0oVHvI8zXOCjLZzjHeJBPGe-G2fLtbiUgE/4/public/values?alt=json", function (data) {
    for (let i = 0; i < data.feed.entry.length; i++) {
        if ($tags.hasOwnProperty([data.feed.entry[i]['gsx$seção']['$t']])) {
            $tags[data.feed.entry[i]['gsx$seção']['$t']].push({
                'tag': data.feed.entry[i]['gsx$tags']['$t'],
                'perfis': data.feed.entry[i]['gsx$perfis']['$t'].split(';'),
                'desc': data.feed.entry[i]['gsx$descrição']['$t'], 'tipo': data.feed.entry[i]['gsx$tipo']['$t']
            });
        } else {
            $tags[data.feed.entry[i]['gsx$seção']['$t']] = [];
            $tags[data.feed.entry[i]['gsx$seção']['$t']].push({
                'tag': data.feed.entry[i]['gsx$tags']['$t'],
                'perfis': data.feed.entry[i]['gsx$perfis']['$t'].split(';'),
                'desc': data.feed.entry[i]['gsx$descrição']['$t'],
                'tipo': data.feed.entry[i]['gsx$tipo']['$t']
            });
        }
    }
    for (var key in $tags) {
        $('#filters').append(`<a class='subheader'><h5>${key}</h5></a>`);
        $('#filters').append(makeFilter($tags[key], key));
    }
});

/**
 * Get notebooks from sheets
 */
$.getJSON("https://cors-anywhere.herokuapp.com/https://spreadsheets.google.com/feeds/list/1xDHAlrMEv0oVHvI8zXOCjLZzjHeJBPGe-G2fLtbiUgE/2/public/values?alt=json", function (data) {
    for (let i = 0; i < data.feed.entry.length; i++) {
        if (data.feed.entry[i]['gsx$preço']['$t'] !== "#N/A" && data.feed.entry[i]['gsx$preço']['$t'] !== "" && data.feed.entry[i]['gsx$preço']['$t'] !== "#VALUE!") {
            $notebook = {
                modalReference: i,
                tags: data.feed.entry[i]['gsx$tags']['$t'].split(";"),
                imagem: data.feed.entry[i]['gsx$imagem']['$t'],
                marca: data.feed.entry[i]['gsx$marca']['$t'],
                modelo: data.feed.entry[i]['gsx$modelo']['$t'],
                preco: data.feed.entry[i]['gsx$preço']['$t'],
                linkAmericanas: data.feed.entry[i]['gsx$afiliadoamericanas']['$t'],
                linkSubmarino: data.feed.entry[i]['gsx$afiliadosubmarino']['$t']
            };
            $notebookDetails = {
                modalReference: i,
                marca: data.feed.entry[i]['gsx$marca']['$t'],
                modelo: data.feed.entry[i]['gsx$modelo']['$t'],
                peso: data.feed.entry[i]['gsx$pesolíq.aproximadodoprodutokg']['$t'],
                tela: data.feed.entry[i]['gsx$polegadasdatela']['$t'],
                ram: data.feed.entry[i]['gsx$memóriaram']['$t'],
                hd: data.feed.entry[i]['gsx$hd']['$t'],
                ssd: data.feed.entry[i]['gsx$ssd']['$t'],
                cor: data.feed.entry[i]['gsx$cor']['$t'],
                processador: data.feed.entry[i]['gsx$processador']['$t'],
                placadevideo: data.feed.entry[i]['gsx$placadevídeo']['$t'],
                os: data.feed.entry[i]['gsx$sistemaoperacional']['$t']
            };
            $notebooks.push($notebook);
            $('#modals').append(makeModal($notebookDetails));
        }
    }

    $('.modal').modal();
    priceFilter([0.0, 1000.0]);
    filter();
});

/**
 * Add to the page from the filtered notebooks
 */
function addToPage() {
    if ($notebooksFiltered.length > 0) {
        for (let i = 0; i < $notebooksFiltered.length; i++) {
            switch (i % 3) {
                case 0:
                    $("#first-column").append(makeCard($notebooksFiltered[i]));
                    break;

                case 1:
                    $("#second-column").append(makeCard($notebooksFiltered[i]));
                    break;

                case 2:
                    $("#third-column").append(makeCard($notebooksFiltered[i]));
                    break;
            }
        }
    } else {
        $('#error-msg').append("<h3 style='padding-top: 25vh'>Nenhum notebook encontrado!</h3>");
    }

}

/**
 * Clear all the html DOM which contain notebooks
 */
function clearAll() {
    $("#first-column").empty();
    $("#second-column").empty();
    $("#third-column").empty();
    $("#error-msg").empty();
}

/**
 * Do the radio boxes treatment
 */
function radioTreatment(group, tag) {
    if ($lastRadioClicked[group] === '' && tag !== 'todos') {
        $lastRadioClicked[group] = tag;
        checkBox($lastRadioClicked[group]);
    } else {
        if (tag === 'todos') {
            checkBox($lastRadioClicked[group]);
            $lastRadioClicked[group] = '';
        } else {
            checkBox($lastRadioClicked[group]);
            $lastRadioClicked[group] = tag;
            checkBox($lastRadioClicked[group]);
        }
    }
}

/**
 * Check if a checkbox is checked
 * then filter
 */
function checkBox(param) {
    $position = $tagsChecked.indexOf(param);

    if ($position > -1) {
        $tagsChecked.splice($position, 1);
    } else {
        $tagsChecked.push(param);
    }

    filter();
}

/**
 * Do all the filtering stuff
 */
function filter() {
    $notebooksFiltered = [];
    for (let i = 0; i < $notebooksByPrice.length; i++) {
        let canBeAdded = true;
        for (let j = 0; j < $tagsChecked.length; j++) {
            if ($notebooksByPrice[i].tags.indexOf($tagsChecked[j]) === -1) {
                canBeAdded = false;
                j = $tagsChecked.length;
            }
        }
        if (canBeAdded) {
            $notebooksFiltered.push($notebooksByPrice[i]);
        }
    }
    clearAll();
    addToPage();
}

/**
 * Receives an array with tags to be clicked
 */
function click(param) {
    while (param.length > 0) {
        $('#' + param.pop().replace(/ /g, '-') + '-span').trigger('click');
    }
}

/**
 * Check if a profile exists in a tag
 */
function profileExists(profile) {
    $response = [];

    for (var key in $tags) {
        for (var i = 0; i < $tags[key].length; i++) {
            if ($tags[key][i].perfis.indexOf(profile) > -1) {
                $response.push($tags[key][i].tag);
            }
        }
    }

    return $response;
}

/**
 * Filter by price
 */
function priceFilter(price) {
    $notebooksByPrice = [];
    if (price[0] !== 0.0) {
        for (var i = 0; i < $notebooks.length; i++) {
            if ($notebooks[i].preco !== 'Carregando…') {
                var x = $notebooks[i].preco.split(/[\s$,.]+/);
                x.shift();
                var xFloat = x.pop();
                if (price[0] < parseFloat(x.join('') + '.' + xFloat) && parseFloat(x.join('') + '.' + xFloat) < price[1]) {
                    $notebooksByPrice.push($notebooks[i]);
                }
            }

        }
    } else {
        $notebooksByPrice = $notebooks;
    }
    filter();
}
