# Paintball-Discord
Hodgap gave me this idea, so I did something bruteforce but it seems work lol

Note : this code version require server with discord's Gradient name (nitro booster feature) 


#Quick brief :
usage 

<img width="473" height="202" alt="image" src="https://github.com/user-attachments/assets/a6eccc0b-7727-436e-be1e-709429010759" />

you put these bullet : 🔴🟠🟡🟢🔵🟣⚫⚪🟤 (:[COLOR_NAME]_circle: emote in Discord) and tag spacific user to throw the ball to them

and the color of the name will be change 

#Code anatomy
some config in config.json, 2 slash commands,  and Events catcher on index.js

🟣 config.json
You may already have it in your bot project,
add paintballChannelId to let the bot listen paintball command in only one message channel(the number is channel id)

<img width="638" height="197" alt="image" src="https://github.com/user-attachments/assets/20ab76ae-484b-47fb-b812-2d3442544f47" />


🟢 2 Slash commands
you mau just copy these file and use as it is, i already add comment to explain how it work
located in commands/utility folder

<img width="295" height="99" alt="image" src="https://github.com/user-attachments/assets/86384f81-b166-4183-85e8-ea07dd8de296" />

the /paintball_role_setup is for creating 81 roles for paintball gradient color
** Since the discord seems to limit only 250 roles per server, this command sometimes not going to work if using it repeatly you may test it in other server first before inject to your own server

the /paintball_role_remove is for clean up these roles after the paintball event finished it will revoce all role started with paintball-

🟡 Event catcher in index.js 

add the config before the paintball Event function

<img width="605" height="69" alt="image" src="https://github.com/user-attachments/assets/2ee9d11a-8d06-4e80-b95f-a9e974c29426" />

then the event function is located on line 84-180 

<img width="697" height="408" alt="image" src="https://github.com/user-attachments/assets/e52fc547-0c23-4279-857e-c46e69298a89" />


Please enjoy!! have fun editing it
