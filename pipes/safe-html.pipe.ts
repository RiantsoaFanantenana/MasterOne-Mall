
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  // Explicitly cast to DomSanitizer to resolve 'unknown' type issues in strict TypeScript configurations
  private sanitizer = inject(DomSanitizer) as DomSanitizer;

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
