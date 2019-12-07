// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * VideoJS smdownload plugin.
 *
 * @package    videojs_smdownload
 * @copyright  2019 Matt Porritt <mattp@catalyst-au.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['media_videojs/video-lazy'], function(videojs) {

    // Get menu button component.
    const MenuButton = videojs.getComponent('MenuButton');
    const MenuItem = videojs.getComponent('MenuItem');

    // Default options for the plugin.
    const defaults = {
      beforeElement: 'fullscreenToggle',
      textControl: 'Download',
    };


    /**
     * Download menu item class.
     * Responsible for adding menu items to the menu button.
     */
    class DownloadMenuItem extends MenuItem {

        /**
         * Class constructor.
         */
        constructor(player, options) {
          super(player, options);
        }

        handleClick() {
          super.handleClick();
          window.location = this.options_.file;
        }

      }

    /**
     * Download menu button class.
     * Adds download menu button to the VideoJS player UI.
     */
    class DownloadMenuButton extends MenuButton {

        /**
         * Class constructor.
         */
        constructor(player, options) {
          super(player, options);
        }

        /**
         * Allow sub components to stack CSS class names,
         * required to get the menubar button styling working.
         *
         * @return {String} The constructed class name.
         * @method buildCSSClass
         */
         buildCSSClass() {
           return `vjs-smdownload ${super.buildCSSClass()}`;
         }

         /**
          * Add the menu items.
          *
          * @mthod createItems
          * @param {Array} items Existing items.
          * @return {Array} items This items to add.
          */
         createItems(items = []) {
             // Audio download.
             if (this.player_.options_.hasOwnProperty('data-download-audio')) {
                 const audioDownload = {
                         label: 'Audio (mp3)',
                         file: this.player_.options_["data-download-audio"]
                 };
                 items.push(new DownloadMenuItem(this.player_, audioDownload));
             }

             // Video download.
             if (this.player_.options_.hasOwnProperty('data-download-video')) {
                 const videoDownload = {
                         label: 'Video (mp4)',
                         file: this.player_.options_["data-download-video"]
                 };
                 items.push(new DownloadMenuItem(this.player_, videoDownload));
             }

             return items;
           }
    }

    /**
     * Function invoked when the player is ready.
     * When this function is called, the player will have its DOM and child components
     * in place.
     * Here we add the download menu.
     *
     * @function onPlayerReady
     * @param    {Player} player
     * @param    {Object} [options={}]
     */
    const onPlayerReady = (player, options) => {
      let DMButton = player.controlBar.addChild(new DownloadMenuButton(player, options), {});

      DMButton.controlText(options.textControl);

      player.controlBar.el().insertBefore(DMButton.el(),
        player.controlBar.getChild(options.beforeElement).el());

      player.addClass('vjs-smdownload');
    };

    /**
     * Entry point for the smartmedia download plugin.
     * In the plugin function, the value of `this` is a video.js `Player` instance.
     * Function gets sets up the UI menu if there is download media available.
     *
     * @function smdownload
     * @param    {Object} [options={}]
     *           An object of options left to the plugin author to define.
     */
    const smdownload = function(options) {
        // Once player is ready set everything up, but only if we have
        // at least one download file available.
        if ((this.options_.hasOwnProperty('data-download-audio')) || (this.options_.hasOwnProperty('data-download-video'))) {
            this.ready(() => {
                onPlayerReady(this, videojs.mergeOptions(defaults, options));
            });
        }
    };

    // Register the plugin with video.js.
    videojs.registerPlugin('smdownload', smdownload);

});
