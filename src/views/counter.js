// Update the count down every 1 second
const CounterDate = (countDownDate, id) => {
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = new Date(countDownDate).getTime() - now;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (document.getElementById(id) !== null) {
        document.getElementById(id).innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }
}
export default CounterDate;

  // let dateLoading = new Date();
    // let charg_bef = date.getTime();
    // function Enter() {
    //     dateLoading = new Date();
    //     let charg_aft = dateLoading.getTime();
    //     let ch = "La page a été chargée en " + (charg_aft - charg_bef) / 1000 + " seconde(s)";
    //     console.log(ch);
    // }