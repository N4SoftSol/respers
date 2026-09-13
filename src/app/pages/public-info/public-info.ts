import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-public-info',
  standalone: true,
  imports: [JsonPipe],
  // Renders unstyled raw text to mimic a JSON file in the browser
  template: `<pre>{{ infoPayload | json }}</pre>`
})
export class PublicInfo {
  // Map the environment variables to the exact JSON structure you requested
  infoPayload = {
    "Git Update": environment.appInfo.gitUpdate,
    "application": environment.appInfo.application,
    "profiles": environment.appInfo.profiles,
    "status": "UP"
  };
}