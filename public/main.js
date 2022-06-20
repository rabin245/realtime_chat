function getUsername() {
  $("document").ready(function () {
    setTimeout(() => {
      $(".modal").modal("show");
    }, 1000);
    let username;
    $("#save-username").click(function () {
      console.log("clicked");
      username = $("#username").val();
      //   $("#username").val("");
      //   console.log(username);

      $(".modal").modal("hide");
    });
  });
  console.log("inside func", username.value);
  return username;
}

async function test() {
  let username = await getUsername();
  console.log(username.value);

  setTimeout(() => {
    console.log(username.value);
  }, 8000);
}

test();
