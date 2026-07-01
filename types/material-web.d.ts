import type React from 'react'

/**
 * JSX typings for the @material/web custom elements (`md-*`) used in this app.
 * Attributes are kebab-case strings/numbers/booleans; DOM event handlers use
 * lowercase names (onchange/oninput/onclick/onclose/onclosed) so React 19
 * attaches them as native element listeners.
 */
type MdElement<T = Record<string, unknown>> = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  T & {
    class?: string
    slot?: string
    onchange?: (e: Event) => void
    oninput?: (e: Event) => void
    onclick?: (e: Event) => void
    onclose?: (e: Event) => void
    onclosed?: (e: Event) => void
    oncancel?: (e: Event) => void
  }

type ButtonAttrs = {
  disabled?: boolean
  type?: string
  value?: string
  name?: string
  href?: string
  target?: string
  'trailing-icon'?: boolean
}

type TextFieldAttrs = {
  label?: string
  value?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: boolean
  'error-text'?: string
  'supporting-text'?: string
  'prefix-text'?: string
  'suffix-text'?: string
  rows?: number
  name?: string
  min?: number | string
  max?: number | string
  step?: number | string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'md-filled-button': MdElement<ButtonAttrs>
      'md-outlined-button': MdElement<ButtonAttrs>
      'md-text-button': MdElement<ButtonAttrs>
      'md-elevated-button': MdElement<ButtonAttrs>
      'md-filled-tonal-button': MdElement<ButtonAttrs>
      'md-icon-button': MdElement<{
        disabled?: boolean
        toggle?: boolean
        selected?: boolean
        href?: string
        'aria-label'?: string
      }>
      'md-filled-icon-button': MdElement<{ disabled?: boolean; 'aria-label'?: string }>
      'md-filled-tonal-icon-button': MdElement<{ disabled?: boolean; 'aria-label'?: string }>
      'md-outlined-icon-button': MdElement<{ disabled?: boolean; 'aria-label'?: string }>
      'md-fab': MdElement<{ variant?: string; size?: string; label?: string; 'aria-label'?: string }>
      'md-icon': MdElement<{ filled?: boolean }>
      'md-checkbox': MdElement<{ checked?: boolean; indeterminate?: boolean; disabled?: boolean; value?: string; name?: string }>
      'md-radio': MdElement<{ checked?: boolean; disabled?: boolean; value?: string; name?: string }>
      'md-switch': MdElement<{ selected?: boolean; disabled?: boolean; icons?: boolean; 'show-only-selected-icon'?: boolean; value?: string; name?: string; 'aria-label'?: string }>
      'md-slider': MdElement<{
        min?: number
        max?: number
        value?: number
        step?: number
        labeled?: boolean
        ticks?: boolean
        range?: boolean
        'value-start'?: number
        'value-end'?: number
        name?: string
      }>
      'md-filled-text-field': MdElement<TextFieldAttrs>
      'md-outlined-text-field': MdElement<TextFieldAttrs>
      'md-filled-select': MdElement<{ label?: string; value?: string; disabled?: boolean; name?: string; 'supporting-text'?: string }>
      'md-outlined-select': MdElement<{ label?: string; value?: string; disabled?: boolean; name?: string; 'supporting-text'?: string }>
      'md-select-option': MdElement<{ value?: string; selected?: boolean; disabled?: boolean }>
      'md-chip-set': MdElement<{ 'aria-label'?: string }>
      'md-assist-chip': MdElement<{ label?: string; disabled?: boolean; elevated?: boolean; href?: string }>
      'md-filter-chip': MdElement<{ label?: string; selected?: boolean; disabled?: boolean; elevated?: boolean; removable?: boolean }>
      'md-input-chip': MdElement<{ label?: string; disabled?: boolean; removable?: boolean; selected?: boolean }>
      'md-suggestion-chip': MdElement<{ label?: string; disabled?: boolean; elevated?: boolean; href?: string }>
      'md-dialog': MdElement<{ open?: boolean; type?: string }>
      'md-linear-progress': MdElement<{ value?: number; max?: number; indeterminate?: boolean; buffer?: number; 'four-color'?: boolean; 'aria-label'?: string }>
      'md-circular-progress': MdElement<{ value?: number; max?: number; indeterminate?: boolean; 'four-color'?: boolean; 'aria-label'?: string }>
      'md-list': MdElement<{ 'aria-label'?: string }>
      'md-list-item': MdElement<{ type?: string; href?: string; target?: string; disabled?: boolean }>
      'md-divider': MdElement<{ inset?: boolean; 'inset-start'?: boolean; 'inset-end'?: boolean }>
      'md-elevation': MdElement
      'md-ripple': MdElement<{ disabled?: boolean }>
      'md-menu': MdElement<{ anchor?: string; open?: boolean; positioning?: string; 'x-offset'?: number; 'y-offset'?: number }>
      'md-menu-item': MdElement<{ disabled?: boolean; type?: string; href?: string }>
      'md-tabs': MdElement<{ 'active-tab-index'?: number; 'auto-activate'?: boolean }>
      'md-primary-tab': MdElement<{ 'inline-icon'?: boolean; active?: boolean }>
      'md-secondary-tab': MdElement<{ active?: boolean }>
      'md-elevated-card': MdElement
      'md-filled-card': MdElement
      'md-outlined-card': MdElement
      'md-badge': MdElement<{ value?: string; 'has-value'?: boolean }>
    }
  }
}

export {}
