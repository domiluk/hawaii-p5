int main()
{
game:
  while (!key[KEY_ESC])
  {

    rotate(wp, bc, boat.rot);
    int rx, ry, gx, gy;
    for (rx = 0; rx < bc->w; rx++)
      for (ry = 0; ry < bc->h; ry++)
      {
        if (getr(getpixel(bc, rx, ry)) == 254)
        {
          gx = rx;
          gy = ry;
        }
      }

    if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 0)
    {
      /*boat.x -= cos(boat.rot/360 * 2 * 3.1415926535)*boat.xv;
        boat.y -= sin(boat.rot/360 * 2 * 3.1415926535)*boat.yv;*/

      boat.xv *= -0.75;
      boat.yv *= -0.75;
    }

    if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 64)
    {
      boat.cp_one = 1;
    }
    if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 128)
    {
      boat.cp_two = 1;
    }
    if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 32)
    {
      boat.cp_three = 1;
    }
    if (getr(getpixel(alpha, boat.x + gx, boat.y + gy)) == 192 &&
        boat.cp_one == 1 && boat.cp_two == 1 && boat.cp_three == 1)
    {
      boat.cp_one = 0;
      boat.cp_two = 0;
      boat.cp_three = 0;
      boat.last_lap_sec = global_sec - boat.last_lap_sec;
      boat.last_lap_min = global_min - boat.last_lap_min;
      if (boat.last_lap_sec < 0)
      {
        boat.last_lap_min--;
        boat.last_lap_sec = 60 - abs(boat.last_lap_sec);
      }
      if (boat.last_lap_sec + (boat.last_lap_min) * 60 <
          boat.best_lap_sec + (boat.best_lap_min) * 60)
      {
        boat.best_lap_sec = boat.last_lap_sec;
        boat.best_lap_min = boat.last_lap_min;
      }
      boat.round++;
      play_sample(dray, 255, 128, 1000, NULL);
    }

    if (key[KEY_UP]) // && getr(getpixel(alpha,boat.x + gx, boat.y + gy)) ==
                     // 255)
    {
      boat.x += cos(boat.rot / 360 * 2 * 3.1415926535) * boat.xv;
      boat.y += sin(boat.rot / 360 * 2 * 3.1415926535) * boat.yv;
      if (boat.xv < boat.maxspeed && boat.yv < boat.maxspeed)
      {
        boat.xv += boat.speedup;
        boat.yv += boat.speedup;
      }

      if (key[KEY_LEFT])
      {
        boat.rot -= boat.rotate;
      }

      if (key[KEY_RIGHT])
      {
        boat.rot += boat.rotate;
      }
    }
    else
    {
      boat.x += cos(boat.rot / 360 * 2 * 3.1415926535) * boat.xv;
      boat.y += sin(boat.rot / 360 * 2 * 3.1415926535) * boat.yv;

      if (key[KEY_DOWN])
      {
        if (boat.xv > boat.slowdown)
          boat.xv -= boat.slowdown;
        if (boat.yv > boat.slowdown)
          boat.yv -= boat.slowdown;
        if (boat.xv < -boat.slowdown)
          boat.xv += boat.slowdown;
        if (boat.yv < -boat.slowdown)
          boat.yv += boat.slowdown;
      }

      if (boat.xv > boat.slowdown)
        boat.xv -= boat.slowdown;
      if (boat.yv > boat.slowdown)
        boat.yv -= boat.slowdown;
      if (boat.xv < -boat.slowdown)
        boat.xv += boat.slowdown;
      if (boat.yv < -boat.slowdown)
        boat.yv += boat.slowdown;

      if (key[KEY_LEFT])
      {
        boat.rot -= boat.rotate;
      }

      if (key[KEY_RIGHT])
      {
        boat.rot += boat.rotate;
      }
    }

    if (game_mode == MODE_MP)
    {
      rotate(wp, bc, super.rot);
      // int rx, ry, gx, gy;
      for (rx = 0; rx < bc->w; rx++)
        for (ry = 0; ry < bc->h; ry++)
        {
          if (getr(getpixel(bc, rx, ry)) == 254)
          {
            gx = rx;
            gy = ry;
          }
        }

      if (getr(getpixel(alpha, super.x + gx, super.y + gy)) == 0)
      {
        super.xv *= -0.75;
        super.yv *= -0.75;
      }

      if (getr(getpixel(alpha, super.x + gx, super.y + gy)) == 64)
      {
        super.cp_one = 1;
      }
      if (getr(getpixel(alpha, super.x + gx, super.y + gy)) == 128)
      {
        super.cp_two = 1;
      }
      if (getr(getpixel(alpha, super.x + gx, super.y + gy)) == 32)
      {
        super.cp_three = 1;
      }
      if (getr(getpixel(alpha, super.x + gx, super.y + gy)) == 192 &&
          super.cp_one == 1 && super.cp_two == 1 && super.cp_three == 1)
      {
        super.cp_one = 0;
        super.cp_two = 0;
        super.cp_three = 0;
        super.last_lap_sec = global_sec - super.last_lap_sec;
        super.last_lap_min = global_min - super.last_lap_min;
        if (super.last_lap_sec < 0)
        {
          super.last_lap_min--;
          super.last_lap_sec = 60 - abs(super.last_lap_sec);
        }
        if (super.last_lap_sec + (super.last_lap_min) * 60 <
            super.best_lap_sec + (super.best_lap_min) * 60)
        {
          super.best_lap_sec = super.last_lap_sec;
          super.best_lap_min = super.last_lap_min;
        }
        super.round++;
      }

      if (key[KEY_W]) // && getr(getpixel(alpha,boat.x + gx, boat.y + gy)) ==
                      // 255)
      {
        super.x += cos(super.rot / 360 * 2 * 3.1415926535) * super.xv;
        super.y += sin(super.rot / 360 * 2 * 3.1415926535) * super.yv;
        if (super.xv < super.maxspeed && super.yv < super.maxspeed)
        {
          super.xv += super.speedup;
          super.yv += super.speedup;
        }

        if (key[KEY_A])
        {
          super.rot -= super.rotate;
        }

        if (key[KEY_D])
        {
          super.rot += super.rotate;
        }
      }
      else
      {
        super.x += cos(super.rot / 360 * 2 * 3.1415926535) * super.xv;
        super.y += sin(super.rot / 360 * 2 * 3.1415926535) * super.yv;

        if (key[KEY_S])
        {
          if (super.xv > super.slowdown)
            super.xv -= super.slowdown;
          if (super.yv > super.slowdown)
            super.yv -= super.slowdown;
          if (super.xv < -super.slowdown)
            super.xv += super.slowdown;
          if (super.yv < -super.slowdown)
            super.yv += super.slowdown;
        }

        if (super.xv > super.slowdown)
          super.xv -= super.slowdown;
        if (super.yv > super.slowdown)
          super.yv -= super.slowdown;
        if (super.xv < -super.slowdown)
          super.xv += super.slowdown;
        if (super.yv < -super.slowdown)
          super.yv += super.slowdown;

        if (key[KEY_A])
        {
          super.rot -= super.rotate;
        }

        if (key[KEY_D])
        {
          super.rot += super.rotate;
        }
      }
    } // if mode = MODE_MP

    // lava polka

    // camleft1 = boat.x - 256;
    // camup1 = boat.y - 384;
    // if(key[KEY_P])game_mode = MODE_CARRIER;
    if (game_mode == MODE_MP)
    {
      camleft1 = boat.x - 256;
      camup1 = boat.y - 384;

      if (camleft1 < 0)
        camleft1 = 0;
      if (camup1 < 0)
        camup1 = 0;
      if (camup1 > (ostrov->h - 768))
        camup1 = ostrov->h - 768;
      if (camleft1 > (ostrov->w - 1024 + 512))
        camleft1 = ostrov->w - 1024 + 512;
      // 1536       1024
      blit(ostrov, vsetko, 0, 0, 0, 0, 2100, 1900);
      // blit(ostrov,vsetko,camleft1,camup1,0,0,camleft1+1024,camup1+768);
      rotate(boat.bmp, boat.bmp_rot, boat.rot + 90);
      draw_sprite(vsetko, boat.bmp_rot, boat.x, boat.y);
      // vykreslenie pravej polky

      camleft2 = super.x - 256;
      camup2 = super.y - 384;

      if (camleft2 < 0)
        camleft2 = 0;
      if (camup2 < 0)
        camup2 = 0;
      if (camup2 > (ostrov->h - 768))
        camup2 = ostrov->h - 768;
      if (camleft2 > (ostrov->w - 1024 + 512))
        camleft2 = ostrov->w - 1024 + 512;

      rotate(super.bmp, super.bmp_rot, super.rot + 90);
      draw_sprite(vsetko, super.bmp_rot, super.x, super.y);
      blit(vsetko, mb, camleft1, camup1, 0, 0, 512, 768);
      blit(vsetko, mb, camleft2, camup2, 512, 0, 512, 768);
      vline(mb, 512, 0, 768, makecol(rand() % 255, 0, 0));
    }
    if (game_mode == MODE_PRACTICE || game_mode == MODE_CARRIER)
    {
      camleft1 = boat.x - 512;
      camup1 = boat.y - 384;
      if (camleft1 < 0)
        camleft1 = 0;
      if (camup1 < 0)
        camup1 = 0;
      if (camup1 > (ostrov->h - 768))
        camup1 = ostrov->h - 768;
      if (camleft1 > (ostrov->w - 1024))
        camleft1 = ostrov->w - 1024;
      blit(ostrov, mb, camleft1, camup1, 0, 0, camleft1 + 1024, camup1 + 768);
      rotate(boat.bmp, boat.bmp_rot, boat.rot + 90);
      draw_sprite(mb, boat.bmp_rot, boat.x - camleft1, boat.y - camup1);
    }

    if (game_mode == MODE_CARRIER)
    {
      super.x = getAI_x(AI_pos);
      super.y = getAI_y(AI_pos);
      super.rot = getAI_rot(AI_pos);
      if (super.xv > 0.2 || super.yv > 0.2)
      {
        super.x += super.xv;
        super.y += super.yv;
        if (super.xv > super.slowdown)
          super.xv -= super.slowdown;
        if (super.yv > super.slowdown)
          super.yv -= super.slowdown;
        if (super.xv < -super.slowdown)
          super.xv += super.slowdown;
        if (super.yv < -super.slowdown)
          super.yv += super.slowdown;
      }
      rotate(super.bmp, super.bmp_rot, super.rot);
      draw_sprite(mb, super.bmp_rot, super.x - camleft1, super.y - camup1);
    }
    // rest(40);

    if (abs((boat.x - super.x) * (boat.x - super.x)) +
            abs((boat.y - super.y) * (boat.y - super.y)) <=
        90 * 90)
    {
      // boat.xv = -getAI_xres(AI_pos)/3;
      // boat.yv = getAI_yres(AI_pos)/3;
      play_sample(spring, 255, 128, 1000, NULL);
      if (game_mode == MODE_MP)
      {
        float root;
        root = boat.rot;
        boat.rot = super.rot;
        super.rot = root;

        root = boat.xv;
        boat.xv = super.xv;
        super.xv = root;

        root = boat.yv;
        boat.yv = super.yv;
        super.yv = root;
      }
      if (game_mode == MODE_CARRIER)
      {
        boat.xv = cos(getAI_rot(AI_pos) / 360 * 2 * 3.1415926535) * 5;
        boat.yv = sin(getAI_rot(AI_pos) / 360 * 2 * 3.1415926535) * 5;
        boat.rot = getAI_rot(AI_pos);

        super.xv = cos(boat.rot / 360 * 2 * 3.14);
        super.yv = sin(boat.rot / 360 * 2 * 3.14);
      }
      // xpos[AI_pos] += cos(boat.rot/360 * 2 * 3.1415926535)*5;
      // ypos[AI_pos] += sin(boat.rot/360 * 2 * 3.1415926535)*5;
      // calc_AI();
    }

    if (game_mode == MODE_CARRIER)
    {
      AI_pos += 3;
      if (AI_pos == npts - 1)
      {
        AI_pos = 0;
        curspl++;
        super.round++;
      }
    }

    draw_sprite(mb, panel, 512 - 100, 0);
    alfont_set_font_size(pump, 75);
    alfont_textprintf_centre_aa(mb, pump, 512, 0, 0xFFFFFF, ":");
    alfont_textprintf_centre_aa(mb, pump, 555, 0, 0xFFFFFF, "%d", global_sec);
    alfont_textprintf_centre_aa(mb, pump, 472, 0, 0xFFFFFF, "%d", global_min);
    alfont_set_font_size(pump, 20);
    alfont_textprintf_centre_aa(mb, pump, 512, 70, 0xFFFFFF,
                                "powered by DL games");
    alfont_set_font_size(pump, 35);
    alfont_textprintf_aa(mb, pump, 20, 10, 0, "Laps %d", boat.round);
    alfont_textprintf_aa(mb, pump, 20, 40, 0, "Last lap time %d:%d",
                         boat.last_lap_min, boat.last_lap_sec);
    alfont_textprintf_aa(mb, pump, 20, 70, 0, "Best lap time %d:%d",
                         boat.best_lap_min, boat.best_lap_sec);
    if (game_mode == MODE_MP)
    {
      alfont_textprintf_aa(mb, pump, 810, 10, 0, "Laps %d", super.round);
      alfont_textprintf_aa(mb, pump, 810, 40, 0, "Last lap time %d:%d",
                           super.last_lap_min, super.last_lap_sec);
      alfont_textprintf_aa(mb, pump, 810, 70, 0, "Best lap time %d:%d",
                           super.best_lap_min, super.best_lap_sec);
    }
    // textprintf(mb,font,20,20,1024,"%d", super.round);
    if (game_mode != MODE_PRACTICE)
    {
      if (boat.round == winning_laps)
      {
        clear_to_color(mb, 0);
        alfont_set_font_size(pump, 75);
        alfont_textprintf_centre_aa(mb, pump, 512, 384, 0xFFFFFF,
                                    "The winner is...!");
        alfont_set_font_size(pump, 80);
        alfont_textprintf_centre_aa(mb, pump, 512, 434, 0xFFFFFF,
                                    "Player no.1");
        blit(mb, screen, 0, 0, 0, 0, 1024, 768);
        //       rest(3000);
        if (key[KEY_ESC])
          goto main_menu;
      }
      if (super.round == winning_laps)
      {
        clear_to_color(mb, 0);
        alfont_set_font_size(pump, 75);
        alfont_textprintf_centre_aa(mb, pump, 512, 384, 0xFFFFFF,
                                    "The winner is...!");
        alfont_set_font_size(pump, 80);
        alfont_textprintf_centre_aa(mb, pump, 512, 434, 0xFFFFFF,
                                    "Player no.2");
        blit(mb, screen, 0, 0, 0, 0, 1024, 768);
        // rest(3000);
        if (key[KEY_ESC])
          goto main_menu;
      }
    }
    else
    {
      if (boat.round == winning_laps)
      {
        clear_to_color(screen, 0);
        alfont_set_font_size(pump, 70);
        alfont_textprintf_centre_aa(screen, pump, 512, 384, 0xFFFFFF,
                                    "your total time in %d lasp is %d:%d",
                                    winning_laps, global_min, global_sec);
        rest(2500);
        goto main_menu;
      }
    }

    blit(mb, screen, 0, 0, 0, 0, 1024, 768);
  }
}
