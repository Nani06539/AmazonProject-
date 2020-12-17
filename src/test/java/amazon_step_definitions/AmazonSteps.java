package amazon_step_definitions;

import amazonPages.AddCart_Page;
import amazonPages.Amazon_page;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import utilities.Config;
import utilities.Driver;

import java.io.File;
import java.io.IOException;

public class AmazonSteps {
      Amazon_page amazon_page = new Amazon_page();
      AddCart_Page addCart_page= new AddCart_Page();
    WebDriver driver= Driver.getDriver();

    @Given("User is on amazon home page")
    public void user_is_on_amazon_home_page() {
        driver.get(Config.getProperty("amazonUrl"));

    }

    @When("User search for LG {int}UD{int}-B {int}-Inch {int}k Monitor")
    public void user_search_for_LG_UD_B_Inch_k_Monitor(Integer int1, Integer int2, Integer int3, Integer int4) {
        amazon_page.searchBox.sendKeys("LG 24UD58-B 24-Inch 4k Monitor");
        amazon_page.submitButton.click();
    }



    @When("User chooses LG {int}UD{int}-B {int}-Inch {int}k Monitor")
    public void user_chooses_LG_UD_B_Inch_k_Monitor(Integer int1, Integer int2, Integer int3, Integer int4) {
     amazon_page.lgMonitor.click();
    }

    @Then("User Should be able to add it to cart")
    public void user_Should_be_able_to_add_it_to_cart() {
        amazon_page.addToCartBox.click();

    }

    @When("User search for The Metasploit: The Penetration Tester's Guide Book")
    public void user_search_for_The_Metasploit_The_Penetration_Tester_s_Guide_Book() {
      amazon_page.searchBox.sendKeys("Metasploit: The Penetration Tester's Guide Book");
      amazon_page.submitButton.click();
    }



    @When("User clicks on Metasploit: The Penetration Tester's Guide Book")
    public void user_clicks_on_Metasploit_The_Penetration_Tester_s_Guide_Book() {
        amazon_page.Metasploit.click();

    }

    @When("User search for a cup with a cat on it")
    public void user_search_for_a_cup_with_a_cat_on_it() {
     amazon_page.searchBox.sendKeys("cup with a cat");
     amazon_page.submitButton.click();

    }

    @When("User clicks on the favirote cup")
    public void user_clicks_on_the_favirote_cup() {

        amazon_page.cup.click();

    }

    @When("User should be able to take the screenshot of the page")
    public void user_should_be_able_to_take_the_screenshot_of_the_page() throws IOException {

        File scrFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);

        FileUtils.copyFile(scrFile, new File("c:\\tmp\\screenshot.png"));

    }

    @When("User removes the LG {int}UD{int}-B {int}-Inch {int}k Monitor from the cart")
    public void user_removes_the_LG_UD_B_Inch_k_Monitor_from_the_cart(Integer int1, Integer int2, Integer int3, Integer int4) {
        addCart_page.delete.click();

    }

    @Then("User should not see the LG {int}UD{int}-B {int}-Inch {int}k Monitor in the cart")
    public void user_should_not_see_the_LG_UD_B_Inch_k_Monitor_in_the_cart(Integer int1, Integer int2, Integer int3, Integer int4) {

      Assert.assertTrue(amazon_page.lgMonitor.getAttribute("value").isEmpty());
    }


}