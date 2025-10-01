import { Component, input, OnInit } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';

let apiLoaded = false;

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
  imports: [YouTubePlayerModule],
})
export class SupportVideoComponent implements OnInit {
  videos = input<string[]>();

  constructor() {}

  ngOnInit(): void {
    if (!apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }
  }
}
