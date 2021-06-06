const hostName = (location.hostname === "localhost") ? 'http://localhost:3000' : '';
function onDeleteItem(itemID) {
    const url = `${hostName}/cart/item/${itemID}`
    var xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            location.href = '/cart';
        }
    }
    xHttp.open('delete', url, true)
    xHttp.send();
}

