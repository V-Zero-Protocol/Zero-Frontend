'use client'

import { useState } from 'react'

export function Components() {
  const [sliderValue, setSliderValue] = useState(50)
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="components" className="section">
      <h2 className="md-typescale-headline-medium section-title">Components</h2>
      <p className="md-typescale-body-large section-subtitle">
        Material 3 components in realistic compositions.
      </p>

      <div className="component-grid">
        {/* Buttons card */}
        <div className="component-card">
          <h3 className="md-typescale-title-medium card-title">Buttons</h3>
          <div className="button-row">
            <md-filled-button>Filled</md-filled-button>
            <md-outlined-button>Outlined</md-outlined-button>
            <md-text-button>Text</md-text-button>
          </div>
          <div className="button-row">
            <md-icon-button aria-label="Favorite">
              <md-icon>favorite</md-icon>
            </md-icon-button>
            <md-icon-button aria-label="Share">
              <md-icon>share</md-icon>
            </md-icon-button>
            <md-icon-button aria-label="More">
              <md-icon>more_vert</md-icon>
            </md-icon-button>
          </div>
        </div>

        {/* Form card */}
        <div className="component-card">
          <h3 className="md-typescale-title-medium card-title">Form</h3>
          <form className="form-demo">
            <md-filled-text-field
              label="Email"
              type="email"
              required
              supporting-text="We'll never share your email"
            />
            <md-outlined-text-field label="Password" type="password" required />
            <label className="checkbox-label md-typescale-body-medium">
              <md-checkbox />
              <span>Remember me</span>
            </label>
            <md-filled-button type="submit">Sign in</md-filled-button>
          </form>
        </div>

        {/* Selection controls card */}
        <div className="component-card">
          <h3 className="md-typescale-title-medium card-title">Selection</h3>
          <div className="selection-demo">
            <label className="selection-row md-typescale-body-medium">
              <md-radio name="plan" value="free" />
              <span>Free plan</span>
            </label>
            <label className="selection-row md-typescale-body-medium">
              <md-radio name="plan" value="pro" />
              <span>Pro plan</span>
            </label>
            <md-divider />
            <label className="selection-row md-typescale-body-medium">
              <md-switch />
              <span>Enable notifications</span>
            </label>
          </div>
        </div>

        {/* Slider card */}
        <div className="component-card">
          <h3 className="md-typescale-title-medium card-title">Slider</h3>
          <div className="slider-demo">
            <label className="md-typescale-body-medium">
              Volume: {sliderValue}%
              <md-slider
                min={0}
                max={100}
                value={sliderValue}
                labeled
                oninput={(e: Event) =>
                  setSliderValue(
                    (e.target as HTMLInputElement & { value: number }).value,
                  )
                }
              />
            </label>
          </div>
        </div>

        {/* Chips card */}
        <div className="component-card">
          <h3 className="md-typescale-title-medium card-title">Chips</h3>
          <md-chip-set>
            <md-filter-chip label="React" selected />
            <md-filter-chip label="TypeScript" selected />
            <md-filter-chip label="Next.js" />
            <md-filter-chip label="Material" />
          </md-chip-set>
        </div>

        {/* Tabs card */}
        <div className="component-card">
          <h3 className="md-typescale-title-medium card-title">Tabs</h3>
          <md-tabs
            active-tab-index={activeTab}
            onchange={(e: Event) =>
              setActiveTab(
                (e.target as HTMLElement & { activeTabIndex: number })
                  .activeTabIndex,
              )
            }
          >
            <md-primary-tab>Overview</md-primary-tab>
            <md-primary-tab>Details</md-primary-tab>
            <md-primary-tab>Settings</md-primary-tab>
          </md-tabs>
          <div className="tab-panel md-typescale-body-medium">
            {activeTab === 0 && <p>Overview content goes here.</p>}
            {activeTab === 1 && <p>Details content goes here.</p>}
            {activeTab === 2 && <p>Settings content goes here.</p>}
          </div>
        </div>

        {/* Progress card */}
        <div className="component-card">
          <h3 className="md-typescale-title-medium card-title">Progress</h3>
          <div className="progress-demo">
            <md-linear-progress value={0.7} />
            <p className="md-typescale-body-small">70% complete</p>
          </div>
        </div>
      </div>

      <md-fab variant="primary" aria-label="Create new" className="fab">
        <md-icon slot="icon">add</md-icon>
      </md-fab>
    </section>
  )
}
