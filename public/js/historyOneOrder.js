const hostName = (location.hostname === "localhost") ? 'http://localhost:3000' : '';
function onDeleteOrderDetails(orderID) {
    const url = `${hostName}/order/${orderID}`
    var xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            location.href = '/history';
        }
    }
    xHttp.open('DELETE', url, true);
    xHttp.send();
}