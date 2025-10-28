/**
 * Service Worker Registration Utility
 * Registers and manages the service worker for offline support
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') {
    return null
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers are not supported in this browser')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    })

    console.log('Service Worker registered successfully:', registration)

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          console.log('New content available! Please refresh.')
          // You could show a toast notification here
          if (window.confirm('New version available! Reload to update?')) {
            window.location.reload()
          }
        }
      })
    })

    // Check for waiting service worker
    if (registration.waiting) {
      // Service worker waiting to activate
      console.log('Service Worker is waiting to activate')
    }

    // Check for updates every hour
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000)

    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false
  }

  if (!('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      const success = await registration.unregister()
      console.log('Service Worker unregistered:', success)
      return success
    }
    return false
  } catch (error) {
    console.error('Service Worker unregistration failed:', error)
    return false
  }
}

/**
 * Request permission for push notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported')
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission
  }

  return Notification.permission
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const permission = await requestNotificationPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return null
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
      )
    })

    console.log('Push notification subscription:', subscription)
    return subscription
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error)
    return null
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray as Uint8Array<ArrayBuffer>
}
