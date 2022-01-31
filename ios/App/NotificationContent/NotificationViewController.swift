import CTNotificationContent

class NotificationViewController: CTNotificationViewController {
    
    override func viewDidLoad() {
        self.contentType = .contentSlider // default is .contentSlider, just here for illustration
        super.viewDidLoad()
    }
    
}
