import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InitialsPipe } from '@modules/users/pipes/intitials.pipe';


/**
 * UserAvatar Component
 *
 * This component displays a circular avatar containing the user's initials.
 * The background color is deterministically generated based on the user's ID
 *
 * Inputs:
 * - userName: string — The full name of the user (used to extract initials via pipe).
 * - userId: number — A unique user identifier used to generate a unique background color.
 *
 */
@Component({
  selector: 'user-avatar',
  imports: [InitialsPipe],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent { 

  userName = input.required<string>();
  userId = input.required<number>();

  /**
   * Generates a unique, visually distinct background color based on the user's ID.
   *
   * @param id - User ID
   * @returns HSL color string
   */
  getColorFromId(id: number): string {
    const goldenAngle = 137.508;

    const hue = (id * goldenAngle) % 360;
    const saturation = 65;
    const lightness = 55;

    return `hsl(${hue.toFixed(0)}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Returns the generated background color for this avatar.
   */
  get backgroundColor(): string {
    return this.getColorFromId(this.userId());
  }

}
