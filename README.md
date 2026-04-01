# Paintball-Discord
Hodgap gave me this idea, so I did something bruteforce but it seems work lol

Note : this code version require server with discord's Gradient name (nitro booster feature) 


#Quick brief :
usage 

<img width="473" height="202" alt="image" src="https://github.com/user-attachments/assets/019d2d54-e847-4b00-b5f6-a86b865bff02" />



you put these bullet : 🔴🟠🟡🟢🔵🟣⚫⚪🟤 (:[COLOR_NAME]_circle: emote in Discord) and tag spacific user to throw the ball to them

and the color of the name will be change 

#Code anatomy

some config in config.json, 2 slash commands,  and Events catcher on index.js

🟣 config.json
You may already have it in your bot project,
add paintballChannelId to let the bot listen paintball command in only one message channel(the number is channel id)

<img width="638" height="197" alt="image" src="https://github.com/user-attachments/assets/e6d8b440-af8a-4662-bb15-e7cd91ff527f" />


🟢 2 Slash commands
you may just copy these file and use as it is, I already add comment to explain how it work
located in commands/utility folder

<img width="295" height="99" alt="image" src="https://github.com/user-attachments/assets/e12d5286-dc06-4f84-b360-d2c913464960" />

the /paintball_role_setup is for creating 81 roles for paintball gradient color
** Since the discord seems to limit only 250 roles per server, this command sometimes not going to work if using it repeatly you may test it in other server first before inject to your own server

<img width="543" height="138" alt="image" src="https://github.com/user-attachments/assets/8edade57-a0f1-4be8-b93e-974506584412" />


the /paintball_role_remove is for clean up these roles after the paintball event finished it will remove all role started with paintball-

Note : the bot role better stay over other-color roles in the role list


🟡 Event catcher in index.js 

add the config. This will tell the bot to listen command from only one text channel

<img width="605" height="69" alt="image" src="https://github.com/user-attachments/assets/75c696ca-d7b6-4ae9-892c-69d7937f400b" />

then the event function is located on line 84-180 

<img width="697" height="408" alt="image" src="https://github.com/user-attachments/assets/35bc4bef-75db-4ac8-8f88-0410892934b8" />


Please enjoy!! have fun editing it
