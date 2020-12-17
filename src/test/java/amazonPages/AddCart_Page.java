package amazonPages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import utilities.Driver;

public class AddCart_Page {

    public AddCart_Page() {

        PageFactory.initElements(Driver.getDriver(), this);
    }
    @FindBy(xpath = "(//input[@class='a-color-link'])[9]")

    public WebElement delete;
}
