package amazonPages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import utilities.Driver;

public class Amazon_page {
    public Amazon_page() {

        PageFactory.initElements(Driver.getDriver(), this);
    }
  @FindBy(xpath = "//input[@type= 'text'][1]")

    public WebElement searchBox;

    @FindBy(xpath = "//input[@type='submit'][1]")
    public WebElement submitButton;

    @FindBy(xpath = "(//span[@class='a-size-medium a-color-base a-text-normal'])[3]")
    public WebElement lgMonitor;

    @FindBy(id = "add-to-cart-button")
    public WebElement addToCartBox;

    @FindBy (xpath = "(//span[@class='a-size-medium a-color-base a-text-normal'])[3]")
    public WebElement Metasploit;

    @FindBy(xpath = "(//span[@class='a-size-base-plus a-color-base a-text-normal'])[3]")
    public WebElement cup;

    @FindBy(xpath = "//input[@name='submit.delete.C12738a87-043e-45b6-99dd-1a5d454ea0ce']")
    public WebElement delete;

}
