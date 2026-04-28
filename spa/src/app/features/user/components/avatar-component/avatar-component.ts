import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar-component',
  imports: [NgClass],
  templateUrl: './avatar-component.html',
  styleUrl: './avatar-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  initials = input<string>();
  sizePreset = input<'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  id = input<number>();
  color = computed(()=>{
    return this.getAvatarColor(this.id());
  })


  sizeClasses = computed(() => {
    const presets = {
      xxs: 'w-10 h-10 text-xs md:w-12 md:h-12 md:text-sm',
      xs: 'w-16 h-16 text-lg md:w-20 md:h-20 md:text-xl',
      sm: 'w-20 h-20 text-2xl md:w-28 md:h-28 md:text-3xl',
      md: 'w-32 h-32 text-4xl md:w-48 md:h-48 md:text-6xl',
      lg: 'w-40 h-40 text-5xl md:w-56 md:h-56 md:text-7xl',
      xl: 'w-48 h-48 text-6xl md:w-64 md:h-64 md:text-8xl'
    };
    return presets[this.sizePreset()];
  });

  getAvatarColor(id: number): string {
    const hue = (id * 137) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }

 }
