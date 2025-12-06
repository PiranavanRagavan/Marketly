import React, { useState, useEffect } from 'react';
import { Accessibility, Sun, Moon, Contrast, Type, Eye, Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

type Theme = 'light' | 'dark' | 'high-contrast';
type TextSize = 'normal' | 'large' | 'extra-large';

interface AccessibilitySettings {
  theme: Theme;
  textSize: TextSize;
  screenReaderMode: boolean;
  showAltText: boolean;
  closedCaptions: boolean;
}

const defaultSettings: AccessibilitySettings = {
  theme: 'light',
  textSize: 'normal',
  screenReaderMode: false,
  showAltText: false,
  closedCaptions: false,
};

export const AccessibilityMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  // Apply settings whenever they change
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // Apply theme
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(settings.theme);

    // Apply text size
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-extra-large');
    document.documentElement.classList.add(`text-${settings.textSize}`);

    // Apply screen reader mode
    if (settings.screenReaderMode) {
      document.body.setAttribute('aria-live', 'polite');
    } else {
      document.body.removeAttribute('aria-live');
    }

    // Apply alt text visibility
    if (settings.showAltText) {
      document.documentElement.classList.add('show-alt-text');
    } else {
      document.documentElement.classList.remove('show-alt-text');
    }

    // Apply closed captions
    if (settings.closedCaptions) {
      document.documentElement.classList.add('show-captions');
    } else {
      document.documentElement.classList.remove('show-captions');
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
            aria-label="Open accessibility menu"
          >
            <Accessibility className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Accessibility Settings</SheetTitle>
            <SheetDescription>
              Customize your browsing experience
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Theme</Label>
              <RadioGroup
                value={settings.theme}
                onValueChange={(value) => updateSetting('theme', value as Theme)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center cursor-pointer">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center cursor-pointer">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high-contrast" id="high-contrast" />
                  <Label htmlFor="high-contrast" className="flex items-center cursor-pointer">
                    <Contrast className="h-4 w-4 mr-2" />
                    High Contrast
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Text Size */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Text Size</Label>
              <RadioGroup
                value={settings.textSize}
                onValueChange={(value) => updateSetting('textSize', value as TextSize)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="flex items-center cursor-pointer">
                    <Type className="h-4 w-4 mr-2" />
                    Normal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large" className="flex items-center cursor-pointer">
                    <Type className="h-5 w-5 mr-2" />
                    Large
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extra-large" id="extra-large" />
                  <Label htmlFor="extra-large" className="flex items-center cursor-pointer">
                    <Type className="h-6 w-6 mr-2" />
                    Extra Large
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Screen Reader Mode */}
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="screen-reader" className="flex items-center cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                Screen Reader Mode
              </Label>
              <Switch
                id="screen-reader"
                checked={settings.screenReaderMode}
                onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
              />
            </div>

            {/* Show Alt Text */}
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="alt-text" className="flex items-center cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                Show Image Alt Text
              </Label>
              <Switch
                id="alt-text"
                checked={settings.showAltText}
                onCheckedChange={(checked) => updateSetting('showAltText', checked)}
              />
            </div>

            {/* Closed Captions */}
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="captions" className="flex items-center cursor-pointer">
                <Subtitles className="h-4 w-4 mr-2" />
                Closed Captions
              </Label>
              <Switch
                id="captions"
                checked={settings.closedCaptions}
                onCheckedChange={(checked) => updateSetting('closedCaptions', checked)}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
