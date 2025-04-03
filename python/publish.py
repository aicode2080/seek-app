import os
import subprocess
import time
import sys
import json

print("正在执行publish 操作...")

# 保存原始脚本路径用于重启
SCRIPT_PATH = os.path.abspath(sys.argv[0])

IGNORE_ERRORS = [
    "→ lib/",
    "created lib/",
    "npm notice",
    "npm WARN"
]

def run_cmd(cmd, desc=""):
    print(f"\n执行命令: {desc if desc else cmd}")
    
    # 设置环境变量
    env = os.environ.copy()
    env['NVM_DIR'] = os.path.expanduser('~/.nvm')
    
    try:
        # 如果是 npm 命令，确保先加载 nvm
        if cmd.startswith('npm'):
            full_cmd = f'source ~/.nvm/nvm.sh && {cmd}'
        else:
            full_cmd = cmd

        process = subprocess.Popen(
            full_cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            executable='/bin/bash',
            env=env
        )
        
        while True:
            output = process.stdout.readline()
            error = process.stderr.readline()
            
            if output:
                print(output.strip())
            if error:
                error_text = error.strip()
                should_ignore = any(ignore_text in error_text for ignore_text in IGNORE_ERRORS)
                
                if not should_ignore and ("error" in error_text.lower() and 
                                        "fail" in error_text.lower() and 
                                        "exception" in error_text.lower()):
                    print(f"错误: {error_text}")
                else:
                    print(error_text)
                
            if output == '' and error == '' and process.poll() is not None:
                break
                
        return process.returncode == 0
    except Exception as e:
        print(f"执行出错: {str(e)}")
        return False

def use_nvm_version(version):
    print(f"\n切换 Node.js 版本到: {version}")
    env = os.environ.copy()
    env['NVM_DIR'] = os.path.expanduser('~/.nvm')
    cmd = f'source ~/.nvm/nvm.sh && nvm use {version}'
    subprocess.run(cmd, shell=True, executable='/bin/bash', env=env)

def retry_cmd(cmd, desc="", max_retries=3, retry_delay=3):
    retries = 0
    while retries < max_retries:
        if retries > 0:
            print(f"\n第{retries}次重试 {desc}")
            time.sleep(retry_delay)
        
        if run_cmd(cmd, desc):
            print(f"\n{desc} 执行成功!")
            return True
            
        retries += 1
        
        # 如果已经重试了一定次数还是失败，询问用户是否重新启动脚本
        if retries == 3:
            user_input = input("\n发布失败，是否重新启动脚本? (y/n): ")
            if user_input.lower() == 'y':
                restart_script()
            else:
                print("继续重试...")
                
    print(f"\n{desc} 失败，已重试 {max_retries} 次")
    return False

def restart_script():
    print("\n重新启动脚本...")
    python = sys.executable
    # 使用绝对路径重启脚本
    os.execl(python, python, SCRIPT_PATH)

def increment_package_version():
    """
    增加 package.json 中的版本号
    """
    print("\n增加 package.json 版本号...")
    try:
        # 读取 package.json
        with open('package.json', 'r') as f:
            package_data = json.loads(f.read())
        
        # 获取当前版本
        current_version = package_data['version']
        print(f"当前版本: {current_version}")
        
        # 拆分版本号
        major, minor, patch = current_version.split('.')
        
        # 增加补丁版本号
        new_patch = str(int(patch) + 1)
        new_version = f"{major}.{minor}.{new_patch}"
        
        # 更新版本号
        package_data['version'] = new_version
        
        # 写回 package.json
        with open('package.json', 'w') as f:
            json.dump(package_data, f, indent=2)
        
        print(f"版本已更新为: {new_version}")
        return True
    except Exception as e:
        print(f"更新版本号出错: {str(e)}")
        return False

if __name__ == "__main__":
    try: 
        print("切换到上级目录")
        os.chdir("..")

        # 切换nvm版本
        use_nvm_version('22')
        time.sleep(1)  # 等待版本切换完成

        # 执行 npm build
        if not run_cmd('npm run build', "执行构建"):
            raise Exception("构建失败")

        # 切换nvm版本
        use_nvm_version('12')
        time.sleep(1)  # 等待版本切换完成

          # 增加版本号
        # if not increment_package_version():
        #     raise Exception("增加版本号失败")

        # 上传到本地npm服务
        if not retry_cmd('npm publish --force-publish', "npm publish --force-publish 发布到npm", max_retries=10, retry_delay=3):
            user_input = input("\n发布最终失败，是否重新启动脚本? (y/n): ")
            if user_input.lower() == 'y':
                restart_script()
            else:
                raise Exception("发布失败，用户选择不重启")

        # 切换到测试项目目录
        print("\n切换到测试项目目录")
        os.chdir('test-seek-app')
        
        # 切换nvm版本
        use_nvm_version('21')
        time.sleep(1)  # 等待版本切换完成

        # 安装seek-app  
        if not run_cmd('npm i seek-app -g', "安装seek-app"):
            raise Exception("安装seek-app失败")

        # 执行seek-app s
        if not run_cmd('seek-app s', "启动seek-app"):
            raise Exception("启动seek-app失败")

    except Exception as e:
        print(f"\n错误: {str(e)}")