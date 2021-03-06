// @ts-nocheck
class BrowserHelperService {
    static goFullScreen() {
        var elem = document.documentElement;

        /* View in fullscreen */
        function openFullscreen() {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        }
        openFullscreen()

        /* Close fullscreen */
        // function closeFullscreen() {
        //     if (document.exitFullscreen) {
        //         document.exitFullscreen();
        //     } else if (document.webkitExitFullscreen) { /* Safari */
        //         document.webkitExitFullscreen();
        //     } else if (document.msExitFullscreen) { /* IE11 */
        //         document.msExitFullscreen();
        //     }
        // }
    }
}

export default BrowserHelperService;
